﻿using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using QLNhaHang.API.Entities;
using QLNhaHang.API.Exceptions;
using QLNhaHang.API.Helpers;
using QLNhaHang.API.Interfaces;
using QLNhaHang.API.Utils;
using System.Text.RegularExpressions;

namespace QLNhaHang.API.Services
{
    public class MenuService : IMenuService
    {
        private readonly QLNhaHangContext dbContext;
        //private readonly string[] _allowedImageExts;
        //private readonly string _picturePath;

        // Account Cloudinary
        private readonly Cloudinary cloudinary;
        private readonly string CLOUD_NAME = "dfmk60ird";
        public readonly string API_KEY = "582335188286295";
        public readonly string API_SECRET = "KqUtIzYCjZ_ld0eC-4MMq0qhEEY";

        public MenuService()
        {
            dbContext = new QLNhaHangContext();
            //_allowedImageExts = new string[] { "jpg", "jpeg", "png", "gif" };
            //_picturePath = "Picture";
            CloudinaryDotNet.Account account = new CloudinaryDotNet.Account(CLOUD_NAME, API_KEY, API_SECRET);
            cloudinary = new Cloudinary(account);
        }
        

        public IEnumerable<Menu> Get()
        {
            return dbContext.Menus.ToList();
        }

        public Menu GetById(string menuId)
        {
            var menu = dbContext.Menus.Find(menuId);
            if(menu == null)
            {
                throw new QLNhaHangException(String.Format(Resource.QLNhaHangResource.MenuNotFound));
            }
            else
            {
                return menu;
            }
        }

        public Menu Insert(Menu menu)
        {
            using (var trans = dbContext.Database.BeginTransaction())
            {
                EntityUtils<Menu>.ValidateData(menu);
                // Check duplicate MenuName
                var menuCheck = dbContext.Menus.FirstOrDefault(x=>x.MenuName == menu.MenuName);
                if(menuCheck != null)
                {
                    throw new QLNhaHangException(Resource.QLNhaHangResource.MenuNameExist);
                }
                menu.MenuId = Guid.NewGuid().ToString();
                menu.CreatedTime = DateTime.Now;
                menu.Image = SaveImage(menu.Image);
                dbContext.Menus.Add(menu);
                dbContext.SaveChanges();
                trans.Commit();
                return menu;
            }
        }

        public Menu Update(string menuId, Menu menu)
        {
            using (var trans = dbContext.Database.BeginTransaction())
            {
                EntityUtils<Menu>.ValidateData(menu);
                var menuFind = dbContext.Menus.Find(menuId);
                if(menuFind == null)
                {
                    throw new QLNhaHangException(String.Format(Resource.QLNhaHangResource.MenuNotFound));
                }
                else
                {
                    menuFind.MenuName = menu.MenuName;
                    menuFind.Price = menu.Price;
                    menuFind.CategoryId = menu.CategoryId;
                    menu.Image = SaveImage(menu.Image);
                    menuFind.Description = menu.Description;
                    menuFind.UpdateTime = DateTime.Now;
                    dbContext.Update(menuFind);
                    dbContext.SaveChanges();
                    trans.Commit();
                    return menuFind;
                }
            }
        }

        public void Delete(string menuId)
        {
            using (var trans = dbContext.Database.BeginTransaction())
            {
                var menu = dbContext.Menus.Find(menuId);
                if (menu == null)
                {
                    throw new QLNhaHangException(String.Format(Resource.QLNhaHangResource.MenuNotFound));
                }
                else
                {
                    var lstOrderDetails = dbContext.OrderDetails.Where(x => x.MenuId == menuId);
                    dbContext.RemoveRange(lstOrderDetails);
                    dbContext.SaveChanges();
                    dbContext.Menus.Remove(menu);
                    dbContext.SaveChanges();
                    trans.Commit();
                }
            }
        }

        public PageResult<Menu> GetPaging(string? categoryName, string? keySearch, Pagination? pagination = null)
        {
            var query = dbContext.Menus.Include(x=>x.Category).OrderByDescending(x => x.CreatedTime).AsQueryable();
            if (!string.IsNullOrEmpty(categoryName))
            {
                query = query.Where(x=>x.Category.CategoryName.ToLower().Contains(categoryName.ToLower()));
            }
            if (!string.IsNullOrEmpty(keySearch))
            {
                query = query.Where(x => x.MenuName.ToLower().Contains(keySearch.ToLower()));
            }
            var menus = PageResult<Menu>.ToPageResult(pagination, query).AsEnumerable();
            pagination.TotalCount = query.Count();
            var res = new PageResult<Menu>(pagination, menus);
            return res;
        }

        /// <summary>
        /// Decode base64 image string(nếu có) và lưu vào config path
        /// </summary>
        /// <param name="image"></param>
        /// <returns></returns>
        private string? SaveImage (string? image)
        {
            // Kiểm tra nếu là chuỗi base64
            if(!string.IsNullOrEmpty(image) && Regex.IsMatch(image, @"^data:image\/.+;base64,"))
            {
                //var match = Regex.Match(image, @"^data:image\/(.+);base64,");
                // Định dạng ảnh
                //var ext = match.Groups[1].Value;
                //var name = $"{Guid.NewGuid()}.{ext}";
                // Decode base64 và lưu vào config path
                try
                {
                    //var bytes = Convert.FromBase64String(image.Substring(match.Value.Length));
                    //var path = Path.Combine(_picturePath, name);
                    //File.WriteAllBytes(path, bytes);
                    return UploadImage(image);
                }
                catch
                {
                    throw new QLNhaHangException("Invalid Image");
                }

            }
            return image;
        }

        /// <summary>
        /// Upload ảnh lên Cloudinary
        /// </summary>
        /// <param name="imagePath"></param>
        /// <returns></returns>
        /// <exception cref="QLNhaHangException"></exception>
        private string UploadImage(string imagePath)
        {
            try
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(imagePath)
                };
                var uploadResult = cloudinary.Upload(uploadParams);
                return uploadResult.Url.ToString();
            }
            catch (Exception e) {
                throw new QLNhaHangException(Resource.QLNhaHangResource.ExceptionError);
            }
        }
    }
}
