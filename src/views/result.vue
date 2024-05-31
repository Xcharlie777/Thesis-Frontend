<template>
  <el-container style="height: 100vh;">
    <el-header style="padding: 0;">
      <header-index></header-index>
    </el-header>
    <el-container style="height: 100%;">
      <el-aside width="200px" style="margin:0px 50px 0px 0px;height: 100%">
        <side-index></side-index>
      </el-aside>

      <el-main>
        <div>
          <h2>测试总结</h2>
          <el-table :data="summaryData" border style="width: 100%">
            <el-table-column prop="type" label="Type"></el-table-column>
            <el-table-column prop="count" label="Count"></el-table-column>
            <el-table-column label="Mean initTime (ms)">
              <template slot-scope="scope">{{ scope.row.mean_initTime.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="Std initTime (ms)">
              <template slot-scope="scope">{{ scope.row.std_initTime.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="Mean execution (ms)">
              <template slot-scope="scope">{{ scope.row.mean_execution.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="Std execution (ms)">
              <template slot-scope="scope">{{ scope.row.std_execution.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="Mean latency (ms)">
              <template slot-scope="scope">{{ scope.row.mean_latency.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="Std latency (ms)">
              <template slot-scope="scope">{{ scope.row.std_latency.toFixed(2) }}</template>
            </el-table-column>
          </el-table>

          <h2>函数执行情况</h2>
          <el-table :data="tableData" border style="width: 100%; max-height: 400px; overflow-y: auto;">
            <el-table-column prop="func_name" label="Function Name"></el-table-column>
            <el-table-column prop="start" label="Start"></el-table-column>
            <el-table-column prop="end" label="End"></el-table-column>
            <el-table-column prop="duration" label="Duration"></el-table-column>
            <el-table-column prop="waitTime" label="Wait Time"></el-table-column>
            <el-table-column prop="initTime" label="Init Time"></el-table-column>
            <el-table-column prop="latency" label="Latency"></el-table-column>
            <el-table-column prop="execution" label="Execution"></el-table-column>
          </el-table>
          <el-divider></el-divider>

        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
import SideIndex from "@/components/sideIndex";
import HeaderIndex from "@/components/headerIndex";
import router from "@/router";

export default {
  name: "payloadManagement",
  components: {SideIndex, HeaderIndex},
  data() {
    return {
      tableData: [], // Your data array
      summaryData:[],
    };
  },
  created() {
    const formData = new FormData();
    this.$axios({
      method: 'post',
      url: 'invocation/result',
      data: formData,
    })
        .then((res) => {
          // console.log(res.data)
          if (res.data.errno === 0) {
            console.log(res.data)
            this.tableData=res.data.data.functionTable
            this.summaryData=res.data.data.summary
            this.renderEcharts();
          } else {
            this.$alert('请耐心等待', '测试未结束', {
              confirmButtonText: '查看负载情况',
              callback: action => {
                router.push({ path: '/nowload' });
              }
            });
            this.$message.error(res.data.msg);
          }
          // console.log(nodes)
        })
        .catch((err) => {

          console.log(err);
        });
    },
  mounted() {
    this.renderEcharts();
  },
  methods: {


    renderEcharts() {
      const chartData = this.tableData.reduce((accumulator, currentItem) => {
        const existingItem = accumulator.find(item => item.name === currentItem.func_name);
        if (existingItem) {
          // 如果已经存在相同的函数名，则累加持续时间
          existingItem.value += parseInt(currentItem.duration);
        } else {
          // 如果不存在相同的函数名，则添加新的数据项
          accumulator.push({
            name: currentItem.func_name,
            value: parseInt(currentItem.duration),
          });
        }
        return accumulator;
      }, []);
      console.log(chartData)
      const chart = echarts.init(document.getElementById('echarts'));
      const option = {
        title: {
          text: '函数执行时间分布',
          left: 'center',
        },
        tooltip: {},
        series: [{
          type: 'pie',
          data: chartData,
        }],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style scoped>
/* Your custom styles here */
</style>
