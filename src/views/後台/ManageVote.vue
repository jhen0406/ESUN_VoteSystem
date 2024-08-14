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
      addOrUpIntro:"",
      editModal: false,
      updateVoteName:"",
      count: 0,
      statisticsData: {},
    };
  },
  components: {
    editModal,
  },
  created() {
    this.search();
    
  },
  methods: {
    ...mapActions(dataStore, ["setEditObj", "createOrupdate"]),
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
      return this.statisticsData[itemId] ;
    },
    clearAndSearch(){
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
      } if(addOrUpIntro === ""){
        "項目詳情為必填"
      }
      // 新增投票項目
      let creatObj = {
        id:addOrUpId,
        name: addOrUpName,
        intro:addOrUpIntro,
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
          alert(isCreate? "新增成功" : "更新成功");
          if(isCreate){
            this.voteList.push(creatObj);
            this.addVoteName = "";
            this.addVoteIntro = "";
          } else(
            this.showEdit()
          )
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
      this.setEditObj(this.voteList[index]);
      console.log("選的項目：", this.editObj);
    },
  },
  computed: {
    ...mapState(dataStore, ["editObj"]),
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
  <span>投票項目：</span>
  <input type="text" v-model="this.voteName" />
  <button @click="search()">搜尋</button>
  <button @click="clearAndSearch()">清空並顯示全部</button>
  <button @click="this.delete()"><i class="fa-solid fa-trash-can"></i></button>
  <table class="vote">
    <thead>
      <th scope="col" class="thead">勾選</th>
      <th scope="col" class="thead">項目編號</th>
      <th scope="col" class="thead">投票項目</th>
      <th scope="col" class="thead">編輯</th>
      <th scope="col" class="thead">累積票數</th>
    </thead>
    <tbody>
      <tr class="content" v-for="(item, index) in voteList" :key="item.id">
        <td>
          <input type="checkbox" v-model="deleteCheckbox" :value="item.id" />
        </td>
        <td>{{ index + 1 }}</td>
        <td>{{ item.name }}</td>
        <td>
          <button
            @click="
              this.showEdit();
              this.bringToModal(index);
            "
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
  <editModal v-if="this.editModal" @alertModal="this.showEdit()">
    <!--這個'slotModal'-->
    <template v-slot:header>
      <p>投票項目編輯</p>
    </template>
    <template v-slot:content>
      <p>選擇的投票項目</p>
      <span>名稱</span>
      <input type="text" v-model="this.editObj.name" />
      <span>內容</span>
      <input type="text" v-model="this.editObj.intro" />
      
    </template>
    <template v-slot:footer>
      <button @click="this.createOrUpdate(false)">確認更改</button>
      <button @click="this.showEdit()">取消</button>
    </template>
  </editModal>
  <div class="addArea">
    <span>新增投票項目</span>
    <br />
    <span>投票項目名稱</span>
    <input type="text" v-model="this.addVoteName" />
    <span>項目詳情</span>
    <input type="text" v-model="this.addVoteIntro" />
    <button type="submit" @click="this.createOrUpdate(true)">新增</button>
  </div>
</template>

<style scoped lang="scss"></style>
