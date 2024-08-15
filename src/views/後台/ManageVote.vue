<script>
import editModal from "@/components/EditModal.vue";
import dataStore from "@/store/datastore";
import { mapState, mapActions } from "pinia";

export default {
  data() {
    return {
      voteList: [],
      deleteCheckbox: [],
      voteName: "",
      addVoteName: "",
      addOrUpIntro: "",
      editModal: false,
      updateVoteName: "",
      count: 0,
      statisticsData: {},
      currentPage: 1, // 搜尋結果當前頁數
      itemsPerPage: 10, // 搜尋結果每頁顯示筆數
    };
  },
  components: {
    editModal,
  },
  created() {
    this.search();
    this.setPage(1);
  },
  methods: {
    ...mapActions(dataStore, ["setEditObj", "createOrupdate", "setPage"]),
    search() {
      // 搜尋全部投票紀錄
      let searchObj = {
        name: this.voteName,
      };
      // url
      fetch("http://localhost:8080/vote/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.voteList = data.voteList;
          this.loadStatistics(); // 加載統計數據
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    },
    loadStatistics() {
      // 遍歷每個投票項目的累積票數
      this.voteList.forEach((item) => {
        this.statistics(item.id);
      });
    },
    statistics(itemId) {
      //  統計票數
      let statisticsObj = {
        voteId: itemId,
      };
      // url
      fetch("http://localhost:8080/vote/statistics", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statisticsObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          this.statisticsData[itemId] = data.count;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
      // return this.count;
    },
    getStatistics(itemId) {
      // 如果沒有統計數據，返回加載中的提示
      return this.statisticsData[itemId];
    },
    clearAndSearch() {
      this.voteName = "";
      this.search();
    },
    delete() {
      // 刪除投票項目
      let deleteObj = {
        id_list: this.deleteCheckbox, // 被勾選的問卷形成新編號列表
      };
      console.log(deleteObj);
      if (this.deleteCheckbox.length > 0) {
        this.voteList = this.voteList.filter(
          // 扣除被勾選的問卷成為新的問卷陣列
          (item) => !this.deleteCheckbox.includes(item.id)
        );
        console.log(this.voteList);
        fetch("http://localhost:8080/vote/delete", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(deleteObj),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            alert("已刪除問卷");
          })
          .catch((error) => {
            console.error("error", error);
            alert("發生錯誤，請稍後重試");
            return;
          });
      } else {
        alert("請勾選欲刪除的問卷");
      }
      this.deleteCheckbox = [];
    },
    createOrUpdate(isCreate = false) {
      // 判斷現在要更新還是新增
      let addOrUpName = isCreate ? this.addVoteName : this.editObj.name;
      let addOrUpId = isCreate ? "" : this.editObj.id;
      let addOrUpIntro = isCreate ? this.addVoteIntro : this.editObj.intro;
      if (addOrUpName === "") {
        alert("項目名稱為必填");
        return;
      }
      if (addOrUpIntro === "") {
        ("項目詳情為必填");
      }
      // 新增投票項目
      let creatObj = {
        id: addOrUpId,
        name: addOrUpName,
        intro: addOrUpIntro,
      };

      fetch("http://localhost:8080/vote/create_update", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(creatObj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          alert(isCreate ? "新增成功" : "更新成功");
          if (isCreate) {
            this.voteList.push(creatObj);
            this.addVoteName = "";
            this.addVoteIntro = "";
          } else {this.showEdit();}
            
        })
        .catch((error) => {
          console.error("error", error);
          alert("發生錯誤，請稍後重試");
          return;
        });
    },
    showEdit() {
      // 更新投票項目的彈跳視窗的開關
      this.editModal = !this.editModal;
    },
    bringToModal(index) {
      this.setEditObj(this.calData[index]);
      console.log("選的項目：", this.editObj);
    },
    nextPage() {
      // 下一頁
      // 如果當前頁數比總頁數小，當前頁數 + 1 (翻到下一頁)
      if (this.currentPage < this.totalpages) {
        this.currentPage++;
      }
    },
    prevPage() {
      // 上一頁
      // 如果當前頁數不是1，當前頁數 - 1 (翻到前一頁)
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    changePage(page) {
      // 跳轉到指定頁
      this.currentPage = page;
    },
  },
  computed: {
    ...mapState(dataStore, ["editObj", "page"]),
    totalpages() {
      // 計算搜尋結果總頁數
      return Math.ceil(this.voteList.length / this.itemsPerPage);
    },
    calData() {
      console.log("開始要算分頁的資料", this.voteList);
      // 資料分頁
      // 起始索引位置 : 當前頁數1，共 10筆，因此當頁資料起始位置為0，第一頁的資料為0-10筆
      const startPage = (this.currentPage - 1) * this.itemsPerPage;
      const endPage = startPage + this.itemsPerPage;
      // slice : 從 voteList 中提取從 startPage 到 endPage 的數據，但不包含 endPage
      console.log(this.voteList.slice(startPage, endPage))
      return this.voteList.slice(startPage, endPage);
    },
    calPages() {
      // 動態生成頁碼
      let pages = []; // 將全部頁碼變成一個陣列
      const total = this.totalpages;
      // 從 1 遍歷到總頁數，生成對應的頁碼
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
};
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="bg">
    <div class="searchAndAdd">
      <div class="search leftbox">
        <span class="title">搜尋投票項目</span>
        <div class="line"></div>
        <input
          type="text"
          v-model="this.voteName"
          class="leftInput searchInput"
          placeholder="請輸入項目名稱"
        />
        <br />
        <button @click="search()" class="searchBtn upBtn">搜尋</button>
        <button @click="clearAndSearch()" class="clearBtn upBtn">
          清空並顯示全部
        </button>
      </div>
      <div class="addArea leftbox">
        <span class="title">新增投票項目</span>
        <div class="line"></div>
        <span style="position: absolute; top: 61px">項目名稱</span>
        <input
          type="text"
          v-model="this.addVoteName"
          class="leftInput addUpInput"
          style="top: 58px"
          placeholder="請輸入項目名稱"
        />
        <br />
        <span style="position: absolute; top: 110px">項目詳情</span>
        <input
          type="text"
          v-model="this.addVoteIntro"
          class="leftInput addUpInput"
          style="top: 108px"
          placeholder="請輸入項目詳情"
        />
        <br />
        <button
          type="submit"
          @click="this.createOrUpdate(true)"
          class="upBtn addBtn"
        >
          新增
        </button>
      </div>
    </div>
    <div class="rightArea" style="width: 63%">
      <button @click="this.delete()" class="deleteBtn">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <table class="vote">
        <thead style="height: 36px">
          <th scope="col" class="thead">勾選</th>
          <th scope="col" class="thead">項目編號</th>
          <th scope="col" class="thead">投票項目</th>
          <th scope="col" class="thead">項目詳情</th>
          <th scope="col" class="thead">編輯</th>
          <th scope="col" class="thead">累積票數</th>
        </thead>
        <tbody>
          <tr class="content" v-for="(item, index) in calData" :key="item.id">
            <td>
              <input
                type="checkbox"
                v-model="deleteCheckbox"
                :value="item.id"
              />
            </td>
            <td style="width: 64px">{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.intro }}</td>
            <td>
              <button
                @click="
                  this.showEdit();
                  this.bringToModal(index);
                "
                class="editBtn"
              >
                <i
                  class="fa-solid fa-pen-to-square"
                  style="background-color: transparent"
                ></i>
              </button>
            </td>
            <td>{{ getStatistics(item.id) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="changePage">
        <!-- 上一頁和下一頁按鈕： :disabled 表示在當前頁數 === 特定位置時禁用(不能按) -->
        <button
          class="prevpage page"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          <
        </button>
        <button
          v-for="page in calPages"
          :key="page"
          class="otherPages page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
        <button
          class="nextpage page"
          @click="nextPage"
          :disabled="currentPage === totalpages"
        >
          >
        </button>
      </div>
    </div>
    <editModal v-if="this.editModal" @alertModal="this.showEdit()">
      <template v-slot:header>
        <div
          class="headerArea"
          style="border-bottom: 1px solid gray; padding-bottom: 10px"
        >
          <span style="margin: 20px; font-size: 1.5em; font-weight: 600"
            >投票項目編輯</span
          >
        </div>
      </template>
      <template v-slot:content>
        <div class="contentArea" style="margin: 30px; position: relative">
          <span style="top: 4px" class="editSpan">名稱</span>
          <input
            type="text"
            v-model="this.editObj.name"
            class="editInput"
            style="position: absolute; top: 4px; left: 113px"
          />
          <br />
          <span class="editSpan" style="top: 55px">內容</span>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            v-model="this.editObj.intro"
            class="editInput itemText"
            style="
              position: absolute;
              top: 55px;
              left: 113px;
              height: 100px;
              resize: none;
              padding-top: 10px;
            "
          >
          </textarea>
        </div>
      </template>
      <template v-slot:footer>
        <div class="footerArea">
          <button @click="this.createOrUpdate(false)" class="modalBtn check">
            確認更改
          </button>
          <button @click="this.showEdit()" class="modalBtn cancel">取消</button>
        </div>
      </template>
    </editModal>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color: #d8e7e7;
  height: 85dvh;
  display: flex;
}
.searchAndAdd {
  width: 30%;
  margin-top: 2%;
  margin-right: 5%;
  margin-left: 2%;
  .leftbox {
    height: 40%;
    background-color: #019e97;
    border-radius: 10px;
    padding: 10px;
    color: white;
    position: relative;
  }
  .search {
    margin-bottom: 27px;
    .searchBtn {
      width: 25%;
      left: 10%;
    }
    .clearBtn {
      width: 44%;
      left: 44%;
    }
    .searchInput {
      bottom: 45%;
      left: 14%;
      height: 18%;
    }
  }
  .title {
    margin-left: 8px;
    font-weight: 600;
  }
  .leftInput {
    position: absolute;
    width: 70%;
    background-color: white;
    border-radius: 10px;
    border: none;
    padding-left: 10px;
  }
  .line {
    height: 1px;
    width: 90%;
    margin: 8px auto;
    background: white;
  }
  .upBtn {
    position: absolute;
    height: 20%;
    bottom: 10%;
    border: none;
    border-radius: 50px;
    background-color: #d8e7e7;
    &:hover {
      cursor: pointer;
      border-color: #769292;
      border: 2px solid;
      scale: 105%;
    }
    &:active {
      scale: 95%;
    }
  }
  .addArea {
    height: 49%;
    .addUpInput {
      bottom: 45%;
      left: 23%;
      height: 15%;
    }
    .addBtn {
      width: 90px;
      height: 17%;
      left: 140px;
    }
  }
}
.rightArea {
  position: relative;
  .deleteBtn {
    border: none;
    position: absolute;
    top: 36px;
    font-size: 1.5em;
    left: -8px;
    &:hover {
      color: #518a87;
      cursor: pointer;
    }
  }
  table {
    width: 89%;
    margin-left: 30px;
    margin-top: 39px;
    border-collapse: collapse;
    text-align: center;
    tr:nth-of-type(odd) td {
      background-color: #95c4c2;
    }
    .content {
      height: 31px;
    }
    .editBtn {
      border: none;
      font-size: 1.1em;
      &:hover {
        color: #3a9c99;
        cursor: pointer;
      }
    }
  }
  .changePage {
    position: absolute;
    width: 73%;
    margin: 15px 30px;
    display: flex;
    justify-content: space-evenly;
    padding: 7px 0;
    bottom: 10px;
    left: 30px;
  }

  button.page {
    border: none;
    border-radius: 50px;
    width: 30px;
    height: 30px;
    font-weight: 700;
    color: rgba(47, 55, 61, 0.95);
  }

  .nextpage,
  .prevpage {
    background: #019e97;
    &:hover {
      background-color: #b6cfcd;
      cursor: pointer;
    }
  }

  .otherPages {
    background-color: #b6cfcd;
    &:hover {
      background: #019e97;
      cursor: pointer;
    }
  }

  button:disabled {
    cursor: not-allowed;
    color: #858282;
    background-color: rgb(110 110 110 / 37%);
    &:hover {
      cursor: not-allowed;
      background-color: rgb(110 110 110 / 37%);
    }
  }
}
.editInput {
  border: 1.5px solid black;
  border-radius: 15px;
  width: 360px;
  height: 32px;
  padding-left: 10px;
  font-size: 16px;
}
.editSpan {
  font-size: 1.3em;
  margin-right: 74px;
  margin-left: 32px;
  position: absolute;
}
.footerArea {
  position: absolute;
  bottom: 20px;
}
.modalBtn {
  width: 100px;
  height: 39px;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  position: absolute;
}
.check {
  left: 176px;
  bottom: 10px;
  color: #076763;
  background: #b1cdcb;
  &:hover {
    background-color: #4db2ad;
    cursor: pointer;
  }
}
.cancel {
  bottom: 10px;
  left: 333px;
  background: #bbbbbb;
  &:hover{
    cursor: pointer;
    background-color: #898989;
  }
}
</style>
