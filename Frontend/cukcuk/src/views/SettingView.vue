<template>
  <div class="setting">
    <div class="setting-inner">
      <div class="setting-header">
        <div class="title">
          <p>Settings</p>
        </div>
        <div class="divider"></div>
      </div>
      <div class="setting-content">
        <div class="column2">
          <div>
            <div class="header">
              <div class="title-name">
                <h1>Quản lý thực đơn</h1>
              </div>
              <div class="group-button">
                <button class="btn btn-category" @click="openCategory()">
                  Danh mục món
                </button>
                <button class="btn btn-delete" @click="deleteMenu()">Xóa món</button>
              </div>
            </div>
            <div class="content">
              <div class="type-menu">
                <ul>
                  <li
                    v-for="cate in categories"
                    :key="cate"
                    :class="{ liActive: cate.categoryId == isActive }"
                    @click="ChooseCategory(cate)"
                  >
                    {{ cate.categoryName }}
                  </li>
                </ul>
              </div>

              <div class="grid grid-cols-192 place-content-between gap-10 mt-6">
                <button @click="addMenu()">
                  <div class="item-menu add-new">
                    <div class="material-icons-outlined" style="color: #ea7c69">
                      add
                    </div>
                    <div style="color: #ea7c69">Thêm món mới</div>
                  </div>
                </button>
                <div
                  class="
                    grid grid-cols-192
                    place-content-between
                    gap-10
                    item-menu
                  "
                  v-for="(item, index) in menuOfCategory"
                  :key="index"
                  @dblclick="fixMenu(item)"
                >
                  <div class="item-inner">
                    <div class="div-checbox">
                      <base-checkbox
                        v-model="item.isChecked"
                      />
                    </div>
                    <div class="item-img">
                      <img
                        :src="item.image"
                        className="rounded-full w-[7.5rem] h-[7.5rem] object-cover"
                        alt=""
                      />
                    </div>
                    <p class="line-menuName">{{ item.menuName }}</p>
                    <p>{{ formatMoney(item.price.toString()) }} VNĐ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-center mt-3">
          <div>
            <Pagination
              :currentPage="pagination.currentPage"
              :totalPage="pagination.totalPage"
            />
          </div>
        </div>
        <!-- Component category -->
        <Modal v-model="isShowCategory" :close="closeCategory">
          <div
            class="
              modal
              bg-dark-second
              min-w-[400px]
              absolute
              top-50
              right-50
              rounded-lg
              text-white
              p-6
            "
          >
            <div class="title-name" style="display: flex">
              <h1>Danh mục món</h1>
              <button class="add-category" @click="addCategory()">
                <span
                  class="material-icons-outlined text-3xl"
                  style="color: #ea7c69"
                  >add</span
                >
              </button>
            </div>
            <div style="padding-top: 16px">
              <div
                class="item-category"
                v-for="cate in categories"
                :key="cate"
                @dblclick="fixCategory(cate)"
              >
                <div class="name-category">{{ cate.categoryName }}</div>
                <div>
                  <button
                    class="btn-delfix"
                    @click="deleteCategory(cate.categoryId)"
                  >
                    <span
                      class="material-icons-outlined text-3xl"
                      style="color: #ea7c69"
                    >
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal v-model="formCategory" :close="closeFormCategory">
            <div
              class="
                modal
                bg-dark-second
                min-w-[400px]
                absolute
                top-50
                right-50
                rounded-lg
                text-white
                p-6
              "
            >
              <Form>
                <div class="title-name" style="display: flex">
                  <h1 v-if="modeCategory == 0">Thêm mới danh mục món</h1>
                  <h1 v-if="modeCategory == 1">Chỉnh sửa danh mục món</h1>
                </div>
                <div style="padding-top: 16px">
                  <p>Tên danh mục</p>

                  <div>
                    <FormInput
                      v-model="category.categoryName"
                      name="Tên danh mục"
                      rules="required"
                    />
                  </div>
                </div>
                <div class="divider"></div>
                <div class="footer-category">
                  <button
                    class="w-[150px] text-white rounded-lg py-2 flex-center"
                    style="border: 1px solid #ea7c69"
                    @click="closeFormCategory"
                  >
                    Hủy
                  </button>
                  <button
                    v-if="modeCategory == 0"
                    class="
                      w-[150px]
                      text-white
                      bg-primary
                      rounded-lg
                      py-2
                      flex-center
                    "
                    style="border: 1px solid #ea7c69"
                    type="button"
                    @click="saveCategory(0)"
                  >
                    Thêm mới
                  </button>
                  <button
                    v-if="modeCategory == 1"
                    class="
                      w-[150px]
                      text-white
                      bg-primary
                      rounded-lg
                      py-2
                      flex-center
                    "
                    style="border: 1px solid #ea7c69"
                    type="button"
                    @click="saveCategory(1)"
                  >
                    Lưu
                  </button>
                </div>
              </Form>
            </div>
          </Modal>
        </Modal>
        <!-- Component menu -->
        <Modal v-model="isShowMenu" :close="closeMenu">
          <div
            class="
              modal
              min-h-screen
              bg-dark-second
              min-w-[450px]
              absolute
              top-0
              right-0
              rounded-lg
              text-white
              p-6
            "
          >
            <Form>
              <div class="title-name" style="display: flex">
                <h1 v-if="modeMenu == 0">Thêm món ăn</h1>
                <h1 v-if="modeMenu == 1">Chi tiết món ăn</h1>
              </div>
              <div class="divider"></div>
              <div>
                <div class="field-menu">
                  <p>Loại món</p>
                  <div>
                    <FormInput
                      v-model="categoryName"
                      name="Loại món"
                      disable="true"
                    />
                  </div>
                </div>
                <div class="field-menu">
                  <p>Tên món</p>
                  <div>
                    <FormInput
                      v-model="menu.menuName"
                      name="Tên món"
                      rules="required"
                    />
                  </div>
                </div>
                <div class="field-menu">
                  <p>Giá</p>
                  <div>
                    <FormInput
                      v-model="menu.price"
                      name="Giá"
                      rules="required"
                    />
                  </div>
                </div>
                <div class="field-menu">
                  <p>Đơn vị tính</p>
                  <div>
                    <FormInput
                      v-model="menu.unit"
                      name="Đơn vị tính"
                      rules="required"
                    />
                  </div>
                </div>
                <div class="field-menu">
                  <p>Ảnh</p>
                  <div>
                    <table>
                      <tr>
                        <td style="width: 300px">
                          <FormInput v-model="menu.image" name="Ảnh" />
                        </td>
                        <td><button>Upload</button></td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="field-menu">
                  <p>Mô tả</p>
                  <div>
                    <FormInput v-model="menu.description" name="Mô tả" />
                  </div>
                </div>
              </div>
              <div class="divider"></div>
              <div class="footer-category">
                <button
                  class="w-[150px] text-white rounded-lg py-2 flex-center"
                  style="border: 1px solid #ea7c69"
                  @click="closeMenu"
                >
                  Hủy
                </button>
                <button
                  v-if="modeMenu == 0"
                  class="
                    w-[150px]
                    text-white
                    bg-primary
                    rounded-lg
                    py-2
                    flex-center
                  "
                  style="border: 1px solid #ea7c69"
                  type="button"
                  @click="saveMenu(0)"
                >
                  Thêm mới
                </button>
                <button
                  v-if="modeMenu == 1"
                  class="
                    w-[150px]
                    text-white
                    bg-primary
                    rounded-lg
                    py-2
                    flex-center
                  "
                  style="border: 1px solid #ea7c69"
                  type="button"
                  @click="saveMenu(1)"
                >
                  Lưu
                </button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/api";
import Pagination from "@/components/atoms/Pagination.vue";
import { formatMoney } from "@/utils/formatMoney";
import FormInput from "@/components/atoms/FormInput.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import { Form } from "vee-validate";
export default {
  components: {
    Pagination,
    BaseCheckbox,
    FormInput,
    Form,
  },
  data: () => ({
    categories: [],
    isActive: null,
    boxMenuId: [],
    categoryId: "",
    categoryName: "",
    menuOfCategory: {},
    pagination: {
      currentPage: 1,
      totalPage: 1,
    },
    pageNumber: 1,
    isShowCategory: false,
    isShowMenu: false,
    formCategory: false,
    modeCategory: null,
    modeMenu: null,
    category: {
      categoryId: "",
      categoryName: "",
    },
    menu: {
      menuId: "",
      menuName: "",
      price: "",
      unit: "",
      categoryId: "",
      image: "",
      description: "",
    },
  }),
  created() {
    this.GetCategories();
  },
  watch: {
    categoryName() {
      this.GetMenuOfCategory();
    },
    $route() {
      this.GetMenuOfCategory();
    },
  },
  methods: {
    formatMoney,
    GetCategories() {
      var me = this;
      api
        .get("category")
        .then(function (res) {
          me.categories = res.data;
          me.isActive = me.categories[0].categoryId;
          me.categoryId = me.categories[0].categoryId;
          me.categoryName = me.categories[0].categoryName;
          console.log(me.categories);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    GetMenuOfCategory() {
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      this.pageNumber = Number(searchParams.get("page"));
      var me = this;
      api
        .get(
          `/Menu/paging?categoryName=${encodeURI(
            me.categoryName
          )}&PageSize=9&PageNumber=${this.pageNumber}`
        )
        .then(function (res) {
          me.pagination.currentPage = res.data.pagination.pageNumber;
          me.pagination.totalPage = res.data.pagination.totalPage;
          me.menuOfCategory = res.data.data.map(item => {
            return {
              ...item,
              isChecked: false
            }
          });
          console.log(me.menuOfCategory);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    ChooseCategory(cate) {
      if (cate) {
        this.isActive = cate.categoryId;
        this.categoryId = cate.categoryId;
        this.categoryName = cate.categoryName;
      }
    },
    openCategory() {
      this.isShowCategory = true;
    },
    closeCategory() {
      this.isShowCategory = false;
    },
    addMenu() {
      this.isShowMenu = true;
      this.modeMenu = 0;
      this.menu = {
        menuId: "",
        menuName: "",
        price: "",
        unit: "",
        categoryId: this.categoryId,
        image: "",
        description: "",
      };
    },
    fixMenu(menu) {
      this.isShowMenu = true;
      this.modeMenu = 1;
      this.menu = menu;
    },
    closeMenu() {
      this.isShowMenu = false;
    },
    closeFormCategory() {
      this.formCategory = false;
    },
    addCategory() {
      this.category = {
        categoryId: null,
        categoryName: null,
      };
      this.formCategory = true;
      this.modeCategory = 0;
      console.log(this.category);
    },
    saveCategory(mode) {
      var me = this;
      switch (mode) {
        case 0:
          // thêm mới
          api
            .post("category", me.category)
            .then(function (res) {
              console.log(res);
              me.formCategory = false;
              me.GetCategories();
            })
            .catch(function (err) {
              console.log(err);
            });
          break;
        case 1:
          // sửa
          api
            .put(`category/${me.category.categoryId}`, me.category)
            .then(function (res) {
              console.log(res);
              me.formCategory = false;
              me.GetCategories();
            })
            .catch(function (err) {
              console.log(err);
            });
          break;
      }
    },
    saveMenu(mode) {
      var me = this;
      switch (mode) {
        case 0:
          // thêm mới
          api
            .post("menu", me.menu)
            .then(function (res) {
              console.log(res);
              me.isShowMenu = false;
              me.GetMenuOfCategory();
            })
            .catch(function (err) {
              console.log(err);
            });
          break;
        case 1:
          // sửa
          api
            .put(`menu/${me.menu.menuId}`, me.menu)
            .then(function (res) {
              console.log(res);
              me.isShowMenu = false;
              me.GetMenuOfCategory();
            })
            .catch(function (err) {
              console.log(err);
            });
          break;
      }
    },
    deleteMenu() {
      var me = this;
      api
        .delete(`menu/${me.menuId}`)
        .then(function (res) {
          me.GetMenuOfCategory();
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    deleteCategory(id) {
      var me = this;
      api
        .delete(`category/${id}`)
        .then(function (res) {
          me.GetCategories();
          console.log(res);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    fixCategory(cate) {
      this.formCategory = true;
      this.modeCategory = 1;
      this.category = cate;
      console.log(this.category);
    },
    deleteMenu() {
     var arr = this.menuOfCategory.filter(x=>x.isChecked == true);
     arr = arr.map(x=>{
       return x.menuId;
     });
     var me = this;
     arr.forEach(e => {
       api.delete(`menu/${e}`).then(function(res){
         console.log(res);
         me.GetMenuOfCategory();
       }).catch(function(err){
         console.log(err);
       })
     });
    }
  },
};
</script>

<style scoped>
.setting-inner {
  padding: 24px;
}
.title p {
  font-weight: 600;
  font-size: 28px;
}
.divider {
  border: 1px solid #393c49;
  margin: 24px 0;
}
/* css content */
.column2 {
  background: #1f1d2b;
  border-radius: 8px;
  width: 100%;
  padding: 24px 24px 0 24px;
}
.setting-menu li {
  height: 60px;
  padding: 16px;
  margin: 0px;
  border-bottom: 1px solid #393c49;
  font-size: 18px;
  cursor: pointer;
}
.setting-menu li:hover {
  background: rgba(139, 79, 68, 0.26);
}
.menu-active {
  background: rgba(234, 124, 105, 0.26);
}

.header {
  display: flex;
  justify-content: space-between;
}
.title-name {
  font-weight: 600;
  font-size: 20px;
}
.btn {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  margin: 0 8px;
}
.btn-delete {
  background: #9d0505;
}
.btn-category {
  border: 1px solid #707387;
}
.content {
  padding-top: 16px;
}
.type-menu {
  width: 100%;
  border-bottom: 1px solid #393c49;
}
.type-menu ul {
  display: flex;
}
.type-menu ul li {
  padding: 4px 8px;
  cursor: pointer;
}
.type-menu ul li:hover {
  background: rgba(139, 79, 68, 0.26);
}
.liActive {
  color: #ea7c69;
  border-bottom: 3px solid #ea7c69;
}

.item-menu {
  width: 180px;
  height: 190px;
  border: 1px dashed #393c49;
  border-radius: 8px;
  margin: 0 8px 8px 0;
}
.add-new {
  border: 1px dashed #ea7c69;
  text-align: center;
  padding: 70px 0;
}
.item-inner {
  cursor: pointer;
}
.item-img {
  padding: 5px 30px;
}
.item-inner p {
  width: 180px;
  text-align: center;
}
.div-checbox {
  position: absolute;
}
.line-menuName {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* số dòng hiển thị */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.add-category {
  border: 1px solid #ea7c69;
  max-height: 38px;
  border-radius: 8px;
  margin-left: 16px;
}
.btn-delfix {
  border: 1px solid #ea7c69;
  border-radius: 8px;
}
.item-category {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}
.name-category {
  width: 300px;
  background: #2d303e;
  border: 1px solid #393c49;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px;
}
.footer-category {
  display: flex;
  justify-content: space-between;
}
.field-menu {
  padding-top: 8px;
}
</style>
