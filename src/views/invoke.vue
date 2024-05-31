<template>
  <el-container style="height: 100vh;">
    <el-header style="padding: 0;">
      <header-index></header-index>
    </el-header>
    <el-container style="height: 100%;">
      <el-aside width="200px" style="margin:0px 50px 0px 0px;height: 100%">
        <side-index></side-index>
      </el-aside>

      <el-main style="height: 100%;">
        <el-button v-if="chosen" type="primary" style="margin-bottom: 20px" @click="cleanAll()">返回</el-button>
        <div class="card-container">
          <el-card :class="{ 'selected': chosen && chooseVarying }" key="timeVarying" class="card" >
            <div slot="header" style="font-weight: bold">时变测试</div>
            <div style="min-height: 50px">
              系统在不同的时间段内接受不同程度的负载，以模拟实际生产环境中负载随时间变化的情况。
            </div>
            <el-button v-if="!chosen" type="text" @click="runTimeVarying" >选择</el-button>
          </el-card>
          <el-card :class="{ 'selected': chosen && chooseRealWorld }" key="realWorld" class="card">
            <div slot="header" style="font-weight: bold">负载仿真</div>
            <div style="min-height: 50px">
              系统通过回放真实的函数流量，来模拟出实际用户行为相似的负载。
            </div>
            <el-button v-if="!chosen" type="text" @click="runRealWorld">选择</el-button>
          </el-card>
        </div>
        <div v-if="chosen" class="horizontal-line"></div>
        <div  style="display: flex;">
          <div v-if="chosen"  style="flex: 1;margin-left: 20px;border-radius: 5px;border: 1px solid #ccc;box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);max-width: 40%">
            <h2 style="margin-left: 20px">测试参数选择</h2>
            <el-form v-if="chooseVarying || chooseBursty" ref="testForm" :model="formData" label-width="120px" @submit.native.prevent="submitForm" style="margin-left: 20px">
              <el-form-item label="测试时间长短：" prop="testDuration">
                <el-select v-model="formData.testDuration" placeholder="请选择">
                  <el-option label="短（2分钟）" value="short"></el-option>
                  <el-option label="中（30分钟）" value="medium"></el-option>
                  <el-option label="长（60分钟）" value="long"></el-option>
                </el-select>
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
              <el-form-item>
                <el-button type="info" @click="createInvokation()">查看负载</el-button>
                <el-button type="primary" @click="invokeAction()" native-type="submit">开始测试</el-button>
              </el-form-item>
            </el-form>

            <el-form v-if="chooseRealWorld" ref="testForm" :model="formData" label-width="120px" @submit.native.prevent="submitForm" style="margin-left: 20px">
              <el-form-item label="取样后函数数量" prop="testDuration">
                <el-select v-model="formData.testDuration" placeholder="请选择">
                  <el-option label="少（10个）" value="short"></el-option>
                  <el-option label="中（100个）" value="medium"></el-option>
                  <el-option label="多（1000个）" value="long"></el-option>
                </el-select>
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
              <el-form-item>
                <el-button type="info" @click.native="createInvokation()">查看负载</el-button>
                <el-button type="primary" @click.native="invokeAction" native-type="submit" :disabled="!this.getApplication">开始测试</el-button>
              </el-form-item>
            </el-form>

          </div>

          <el-card v-if="chosen" style="flex: 1; position: relative;left: 10%;max-width: 45%">
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
        </div>

      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import SideIndex from "@/components/sideIndex";
import HeaderIndex from "@/components/headerIndex";

export default {
  name: "publicImages",
  components: {SideIndex, HeaderIndex},
  data() {
    return {
      showPopup:false,
      formData: {
        testDuration: 'short',
        testLoad: 'small',
        testTarget: 'CPU'
      },
      chooseBursty: false,
      getApplication:false,
      chooseVarying: false,
      chooseRealWorld: false,
      chosen: false,
      actionList:{}
    }
  },
mounted() {
  this.checkRunning();
},

  methods: {
    checkRunning(){
      const formData = new FormData();
      this.$axios({
        method: 'post',
        url: 'invocation/result',
        data: formData,
      })
          .then((res) => {
            console.log(res.data)
            if (res.data.errno === 0) {
              console.log(res.data)
            } else {
              this.open()
            }
            // console.log(nodes)
          })
          .catch((err) => {

            console.log(err);
          });
    },
    open() {
      this.$alert('有正在运行的测试', '暂时无法使用', {
        confirmButtonText: '查看负载情况',
        callback: () => {
          this.$router.push('/nowload')
        }
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
    createInvokation(){
      const formData = new FormData();
      if (this.chooseVarying){
        formData.append("type","TimeVaring")

      }
      else if (this.chooseRealWorld){
        formData.append("type","RealWorld")

      }
      else if (this.chooseBursty){
        formData.append("type","Bursty")

      }

      formData.append("testDuration",this.formData.testDuration)
      formData.append("testLoad",this.formData.testLoad)
      formData.append("testTarget",this.formData.testTarget)
      formData.append("start",0)
      formData.append("step",0)
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
    runBursty() {
      this.chooseBursty = true;
      this.chosen = true;
    },
    runTimeVarying() {
      this.chooseVarying = true;
      this.chosen = true;
    },
    runRealWorld() {
      this.chooseRealWorld = true;
      this.chosen = true;
    },
    cleanAll(){
      this.chooseRealWorld = false;
      this.chooseVarying = false;
      this.chooseBursty = false;
      this.chosen = false;
    }
  }
}
</script>

<style scoped>
.card-container {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.card {
  width: calc(50% - 10px); /* Adjust card width based on the number of cards */
  margin-right: 10px;
}

.selected {
  background-color: lightblue; /* Change to the color you desire */
}
.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: lightgrey; /* Change the color as needed */
  margin: 30px 0; /* Adjust margin as needed */
}
</style>
