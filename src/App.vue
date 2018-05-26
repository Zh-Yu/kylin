<template>
  <div id="app">
    
    <div class="personalInfo" v-if="step === 0">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      输入你的名字
      <br /><br /><br />
      <el-input style="width: 60%" v-model="employeeChineseName" />
      <br /><br />
      <el-button type="primary" :loading="fetchExistEmployee" @click="searchEmployee">确定</el-button>
    </div>

    <div class="container" v-else>
      {{employeeChineseName}} 的业务数据
      <br />
      <br />
      <br />
      <el-form label-width="150px">
        <el-form-item v-for="item in performance" :key="item.id" :label="item.chineseName">
          <el-input type="number" :value="item.value" @change="changeItem(item.bizTypeId, $event)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isSaving" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
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
      }
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
}

.container {
  padding: 20px;
}
</style>
