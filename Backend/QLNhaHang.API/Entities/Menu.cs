﻿using QLNhaHang.API.Attribute;
using System;
using System.Collections.Generic;

namespace QLNhaHang.API.Entities
{
    public partial class Menu
    {
        public Menu()
        {
            OrderDetails = new HashSet<OrderDetail>();
        }

        public string? MenuId { get; set; }
        [NotEmpty]
        [PropertyName("Tên món")]
        public string? MenuName { get; set; }
        [NotEmpty]
        [PropertyName("Giá bán")]
        public decimal? Price { get; set; }
        [NotEmpty]
        [PropertyName("Đơn vị tính")]
        public string? Unit { get; set; }
        [PropertyName("Loại món")]
        public string? CategoryId { get; set; }
        [PropertyName("Ảnh đại diện")]
        public string? Image { get; set; }
        [PropertyName("Mô tả")]
        public string? Description { get; set; }
        public DateTime? CreatedTime { get; set; }
        public DateTime? UpdateTime { get; set; }

        public virtual Category? Category { get; set; }
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
