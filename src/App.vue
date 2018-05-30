<template>
  <div id="app">
    
    <div class="personalInfo" v-if="step === 0">
      <div>输入你的名字</div>
      <el-input v-model="employeeChineseName"   class="nameInput"/>
      <div></div>
      <el-button type="primary" :loading="fetchExistEmployee" @click="searchEmployee">确定</el-button>
    </div>

    <div v-else>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#909399"
        text-color="#fff">
        <el-submenu index="1">
          <template slot="title">设置</template>
          <el-menu-item index="1">退出</el-menu-item>
        </el-submenu>
      </el-menu>
      <div class="container">
        <div class="title">{{employeeChineseName}} 的业务数据</div>
        <el-form label-width="120px">
          <el-form-item v-for="item in performance" :key="item.id" :label="item.chineseName">
            <el-input type="number" :value="item.value" @change="changeItem(item.bizTypeId, $event)" />
          </el-form-item>
        </el-form>
        <el-button type="primary" :loading="isSaving" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {serverPrefix} from './config.js';

  export default {
    data() {
      return {
        step: 0,
        fetchExistEmployee: false,
        isSaving: false,
        employeeChineseName: '',
        employeeId: -1,
        performance: [],
        diff: []
      }
    },

    methods: {
      async searchEmployee () {
        this.fetchExistEmployee = true;
        const result = await axios.get(`${serverPrefix}/existEmployee?chineseName=${this.employeeChineseName}`);

        if(!result.data.exist) {
          this.$message({
            type: 'error',
            message: `${this.employeeChineseName} 不存在，请核对您的姓名`
          })
          this.fetchExistEmployee = false;
          return;
        }

        window.localStorage.kylin_employee_chinese_name = this.employeeChineseName;

        let allBizType = (await axios.get(`${serverPrefix}/bizType`)).data;
        const performance = (await axios.get(`${serverPrefix}/getEmployeePerformance?chineseName=${this.employeeChineseName}`)).data;

        this.employeeId = performance[0].employeeId;
        allBizType = allBizType.map(item => ({
          chineseName: item.chineseName,
          bizTypeId: item.id,
          value: (performance.find(p => p.bizTypeId === item.id) || {value: 0}).value
        }));

        this.performance = allBizType;
        this.fetchExistEmployee = false;
        this.step = 1;
      },

      changeItem(bizTypeId, newValue) {
        const index = this.performance.findIndex(item => item.bizTypeId === bizTypeId);
        this.performance[index].value = +newValue;
        if(this.diff.indexOf(bizTypeId) === -1) this.diff.push(bizTypeId);
      },

      async save() {
        const uploadList = this.performance.filter(item => this.diff.indexOf(item.bizTypeId) > -1).map(item => ({
          bizTypeId: item.bizTypeId,
          value: item.value
        }));

        this.isSaving = true;
        await axios({
          method: 'post',
          url: `${serverPrefix}/updateEmployeePerformance`,
          data: {
            employeeId: this.employeeId, 
            updatePerformanceList: uploadList
          }
        });
        this.isSaving = false;
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      },
      handleSelect(){
        console.log("退出")
        window.location.href = "http://localhost:8010/";
      },
    },

    mounted() {
      const savedChineseName = window.localStorage.kylin_employee_chinese_name;

      if(savedChineseName) {
        this.employeeChineseName = savedChineseName;
        this.searchEmployee();
      }
    }
  }
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
  font-size: 20px;
}

.personalInfo{
  margin-top: 50%;
  width: 100%;
}

.nameInput{
  margin: 30px auto;
  width: 250px;

}
.el-submenu{
  float: right !important;
}
.el-submenu__title{
  font-size: 16px;
  margin: 0;
  border: 0 !important;
}
.el-menu--popup{
  min-width: 150px !important;
  text-align: center;
  margin: 0;
  position: absolute;
  top: 0;
  right: -92px;
}
.el-icon-arrow-down:before{
  color: #ffffff;
}

.container {
  padding: 20px;
  background-color: rgba(248,248,251,1);
}

.title{
  margin-bottom: 30px;
  clear: both;
}

.el-form-item__label{
  text-align: center;
}

</style>
