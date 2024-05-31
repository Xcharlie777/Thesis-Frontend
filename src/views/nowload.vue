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
        <h2>
          实时负载
        </h2>
        <div class="echarts-container">
          <div class="chart" ref="cpuChart" style="width: 80%;"></div>
          <div class="chart" ref="memoryChart" style="width: 80%;"></div>
        </div>
        <hr style="margin-bottom:  20px;margin-top: -10px; border: none; border-top: 1px solid #ccc;">
        <div>
          <span style="font-weight: bold;font-size: 20px;position:relative;top: 10%">模拟负载请求</span>
          <div class="shadow-box" style="display: flex; flex-direction: column;">
            <div>
              <div style="display: flex; align-items: center;">
                <div style="font-size: 16px; margin-right: 50px; margin-left: 10px;min-width: 100px">CPU(%):</div>
                <el-slider v-model="CPUValue" show-input :max="80" style="width: 80%;" :step="5" show-stops
                           :disabled="this.$store.state.isGenerate"></el-slider>
              </div>
              <div style="display: flex; align-items: center;margin-top: 30px">
                <div style="font-size: 16px; margin-right: 50px; margin-left: 10px;min-width: 100px">Memory(%):</div>
                <el-slider v-model="memoryValue" show-input :max="80" style="width: 80%;" :step="5" show-stops
                           :disabled="this.$store.state.isGenerate"></el-slider>
              </div>
            </div>
            <div>
              <div style=";margin-left: 35%">
                <el-button type="primary" style="width: 150px" :disabled="this.$store.state.isGenerate"
                           @click="generate()">生成负载
                </el-button>
                <el-button type="primary" style="width: 150px;" :disabled="!this.$store.state.isGenerate"
                           @click="degenerate()">取消负载
                </el-button>
              </div>


            </div>

          </div>

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
  name: "HomePage",
  components: {SideIndex, HeaderIndex},
  data() {
    return {
      cpuPercentageData: [],
      memoryPercentageData: [],
      xAxisData: [],
      cpuChart: null,
      memoryChart: null,
      totalCPU: 0,
      totalMemory: 0,
      CPUValue: 0,
      memoryValue: 0,
      nowCPU: 0,
      nowMemory: 0
    };
  },
  created() {
    this.CPUValue = this.$store.state.CPUValue
    this.memoryValue = this.$store.state.memoryValue
  },
  mounted() {
    this.initCharts();

    setInterval(() => {
      let totalCPU = 0;
      let totalMemory = 0;
      let consumeCPU = 0;
      let consumeMemory = 0;
      let nodes = [];
      const formData = new FormData();
      this.$axios({
        method: 'post',
        url: 'load/getload',
        data: formData,
      })
          .then((res) => {
            let nodes = []
            // console.log(res.data)
            if (res.data.errno === 0) {
              // this.$message.success(res.data.msg);
              // console.log(res.data)
              nodes = res.data.data.nodes;

            } else {
              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
            nodes.forEach(node => {
              const cpuCores = parseFloat(node.CPU_cores);
              const cpuPercentage = parseFloat(node.CPU_percentage);
              const memoryBytes = parseFloat(node.MEMORY_bytes);
              const memoryPercentage = parseFloat(node.MEMORY_percentage);
              consumeCPU += cpuCores;
              consumeMemory += memoryBytes;
              totalCPU += cpuCores / (cpuPercentage / 100);
              totalMemory += memoryBytes / (memoryPercentage / 100);
            });
            this.cpuPercentageData.push(((consumeCPU / totalCPU) * 100).toFixed(2));
            this.nowCPU = parseInt((consumeCPU / totalCPU) * 100);
            this.memoryPercentageData.push(((consumeMemory / totalMemory) * 100).toFixed(2));
            this.nowMemory = parseInt((consumeMemory / totalMemory) * 100);

            // 只保留最近 10 个数据点，以保持图表清晰
            if (this.cpuPercentageData.length > 10) {
              this.cpuPercentageData.shift();
              this.memoryPercentageData.shift();
            }

            // 更新图表
            this.updateCharts();
          })
          .catch((err) => {

            console.log(err);
          });


      // console.log(nodes)

    }, 5000); // 更新间隔，单位为毫秒
  },
  methods: {
    generate() {

      const formData = new FormData();
      formData.append("CPUValue", this.CPUValue)
      formData.append("MemoryValue", this.memoryValue)
      this.$axios({
        method: 'post',
        url: 'load/createload',
        data: formData,
      })
          .then((res) => {
            // console.log(res.data)
            if (res.data.errno === 0) {
              this.$message.success(res.data.msg);
              this.$store.state.CPUValue = this.CPUValue
              this.$store.state.memoryValue = this.memoryValue
              this.$store.state.isGenerate = true
              // console.log(res.data)
              ;

            } else {
              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });

    },
    degenerate() {

      const formData = new FormData();
      this.$axios({
        method: 'post',
        url: 'load/deleteload',
        data: formData,
      })
          .then((res) => {
            // console.log(res.data)
            if (res.data.errno === 0) {
              this.$message.success(res.data.msg);
              this.$store.state.isGenerate = false
              this.$store.state.CPUValue = 0
              this.$store.state.memoryValue = 0
              // console.log(res.data)
              ;

            } else {
              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });


    },
    initCharts() {
      this.cpuChart = echarts.init(this.$refs.cpuChart);
      this.memoryChart = echarts.init(this.$refs.memoryChart);

      this.cpuChart.setOption(this.getOption('CPU 消耗量 (%)'));
      this.memoryChart.setOption(this.getOption('Memory 消耗量 (%)'));
    },
    updateCharts() {
      const time = new Date().toLocaleTimeString();
      this.xAxisData.push(time);
      if (this.xAxisData.length > 10) {
        this.xAxisData.shift();
      }

      const cpuOption = {
        xAxis: {data: this.xAxisData},
        yAxis: {type: 'value', min: 0, max: 100},
        series: [{data: this.cpuPercentageData}]
      };
      const memoryOption = {
        xAxis: {data: this.xAxisData},
        yAxis: {type: 'value', min: 0, max: 100},
        series: [{data: this.memoryPercentageData}]
      };

      this.cpuChart.setOption(cpuOption);
      this.memoryChart.setOption(memoryOption);
    },
    getOption(title) {
      return {
        title: {text: title},
        tooltip: {trigger: 'axis'},
        xAxis: {type: 'category', data: []},
        yAxis: {type: 'value', min: 0, max: 1},
        series: [{type: 'line', data: []}]
      };
    }
  }
};
</script>

<style scoped>
.echarts-container {
  display: flex;
  justify-content: space-around;
}

.chart {
  width: 45%;
  height: 300px;
}

.shadow-box {
  /* 定义阴影效果 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* x偏移量, y偏移量, 模糊半径, 阴影颜色和透明度 */

  /* 设置padding和margin以及其他样式 */
  padding: 20px;
  margin: 20px;
  height: 150px;
  /* 添加边框 */
  border: 1px solid #ccc; /* 边框为1像素实线，颜色为灰色 */
  border-radius: 10px;
}
</style>
