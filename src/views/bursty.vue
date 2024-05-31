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
          <h2>Bursty测试</h2>
          系统在正常负载的基础上，突然发起大量请求，以模拟实际生产环境中可能发生的突发情况。
          <div style="display: flex;align-items: center;margin-top: 30px;">
            <el-card style="width: calc(50% - 10px);min-height: 60vh">
              <h2 style="margin-left: 10px">选择测试参数</h2>
              <el-form
                  ref="testForm"
                  :model="formData"
                  label-width="120px"
                  @submit.native.prevent="submitForm"
                  style="margin-left: 20px;margin-top: 40px; transform: scale(1.1); transform-origin: 0 0;"
              >
                <el-form-item label="初始rps设置">
                  <el-input-number v-model="formData.start" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="rps步数设置">
                  <el-input-number v-model="formData.step" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="测试负载：" prop="testLoad">
                  <el-select v-model="formData.testLoad" placeholder="请选择">
                    <el-option label="小（占用少量内存或CPU）" value="small"></el-option>
                    <el-option label="中（占用一定内存或CPU）" value="medium"></el-option>
                    <el-option label="大（占用大量内存或CPU）" value="large"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="测试目标：" prop="testTarget">
                  <el-select v-model="formData.testTarget" placeholder="请选择">
                    <el-option label="CPU" value="CPU"></el-option>
                    <el-option label="内存" value="Memory"></el-option>
                    <el-option label="综合测试" value="Comprehensive"></el-option>
                  </el-select>
                </el-form-item>
                <el-card v-if="this.getApplication" style="width: 60%;margin-left: 70px;margin-bottom: 20px;transform: scale(0.9); transform-origin: 0 0;">

                  <div slot="header" style="font-weight: bold;">负载详情</div>
                  <div style="display: flex;align-items: center">
                    <br/>
                    <div v-if="this.getApplication" style="width: 300px;border-radius: 5px;border: 1px solid #ccc;margin-left:20px;margin-right: 40px;box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); ">
                      <div  style="margin: 10px">
                        <span style="color: cornflowerblue">用例名：</span>{{ this.actionList.applicationName}}
                        <div style="color: cornflowerblue">参数详情</div>
                        <div v-for="(param,i) in this.actionList.Params" :key="i">
                          <span style="color: indianred">&nbsp;&nbsp;&nbsp;&nbsp;{{param.name}}:</span>{{param.key}}
                        </div>
                      </div>

                    </div>
                  </div>
                </el-card>
              </el-form>
              <div style="text-align: center;;margin-top: 50px">
                <el-button type="info" @click="createInvokation()">查看负载</el-button>
                <el-button type="primary" @click="invokeAction()" native-type="submit" :disabled="!this.getApplication">开始测试</el-button>
              </div>

            </el-card>
            <el-card style="width: calc(50% - 10px);margin-left: 10px;min-height: 60vh">
              <h2>测试结果</h2>
              <el-empty v-if="!getResult">
                <el-button type="primary" @click="getTable()">查看结果</el-button>
              </el-empty>
              <div v-if="getResult">
                失败请求数：<span style="color: cornflowerblue">{{this.unreachable}}</span>
                <br/>
                极限速率（rps）<span style="color: cornflowerblue">{{this.rate}}</span>
                <br/>
                <div style="font-weight: bold;margin-top: 20px">各速率下的函数执行情况：</div>
                <el-table :data="tableData" border style="width: 100%; max-height: 400px; overflow-y: auto;margin-top: 20px">
                  <el-table-column prop="rate" label="Rate"></el-table-column>
                  <el-table-column label="平均延时(ms)">
                    <template slot-scope="scope">{{ scope.row.mean_latency.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column label="平均执行时间(ms)">
                    <template slot-scope="scope">{{ scope.row.mean_execution.toFixed(2) }}</template>
                  </el-table-column>
                  <el-table-column prop="total_count" label="总请求数量"></el-table-column>
                  <el-table-column prop="failed" label="失败请求数量"></el-table-column>
                </el-table>
                <div style="font-weight: bold;margin-top: 20px">函数运行错误统计：</div>
                <el-table :data="this.errors" border style="width: 100%; max-height: 400px; overflow-y: auto;margin-top: 20px">
                  <el-table-column prop="Key" label="错误"></el-table-column>
                  <el-table-column prop="Count" label="数量"></el-table-column>

                </el-table>
              </div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideIndex from "@/components/sideIndex";
import HeaderIndex from "@/components/headerIndex";

export default {
  name: "bursty",
  components: {SideIndex, HeaderIndex},
  data(){
    return{
      formData:[],
      actionList:[],
      tableData:[],
      errors:[],
      getApplication:false,
      getResult:false,
      unreachable:0,
      rate:0,
    }


  },
  methods:{
    submitForm(){

    },
    getTable(){
      const formData = new FormData();
      this.$axios({
        method: 'post',
        url: 'invocation/getbursty',
        data: formData,
      })
          .then((res) => {
            // console.log(res.data)
            if (res.data.errno === 0) {
              console.log(res.data)
              this.unreachable=res.data.data.unreachableInvocations
              this.rate=res.data.data.successTests
              this.getResult=true
              this.tableData=res.data.data.burstyTable
              this.errors=res.data.data.errors
            } else {

              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });
    },
    createInvokation(){
      const formData = new FormData();
      formData.append("type","Bursty")
      formData.append("testDuration",0)
      formData.append("testLoad",this.formData.testLoad)
      formData.append("testTarget",this.formData.testTarget)
      formData.append("start",this.formData.start)
      formData.append("step",this.formData.step)
      this.$axios({
        method: 'post',
        url: 'invocation/create',
        data: formData,
      })
          .then((res) => {
            // console.log(res.data)
            if (res.data.errno === 0) {
              this.$message.success(res.data.msg);
              console.log(res.data)
              this.actionList=res.data.data.application
              this.getApplication=true

            } else {
              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });
    },
    invokeAction(){
      const formData = new FormData();
      this.$axios({
        method: 'post',
        url: 'invocation/invoke',
        data: formData,
      })
          .then((res) => {
            // console.log(res.data)
            if (res.data.errno === 0) {
              this.$message.success(res.data.msg);
              console.log(res.data)
            } else {
              this.$message.error(res.data.msg);
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });
    },
  }
}
</script>

<style scoped>

</style>