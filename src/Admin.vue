<template>
  <div id="app">
    <el-table :data="reportList" border style="width: 100%">
      <el-table-column prop="employeeTeamChineseName" label="部门" width="80" fixed>
      </el-table-column>
      <el-table-column prop="employeeChineseName" label="姓名" width="80" fixed>
      </el-table-column>
      <el-table-column
        v-for="(value, key) in bizType"
        :label="value"
        >
        <template slot-scope="scope">
          {{scope.row.valueList[key] || ''}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import { serverPrefix } from './config.js';

  export default {
    data() {
      return {
        reportList: [],
        bizType: {}
      }
    },

    methods: {
      async fetch() {
        const bizType = await axios.get(`${serverPrefix}/bizType`);
        this.bizType = bizType.data.reduce((prev, cur) => {
          prev[cur.id] = cur.chineseName;
          return prev;
        }, {});
        const report = await axios.get(`${serverPrefix}/report`);
        this.reportList = report.data;
      }
    },

    mounted() {
      this.fetch();
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
