<template>
  <el-dialog title="新建负载" :visible.sync="newDialogVisible" width="40%">
    <div>
      <el-form label-width="180px">
        <el-form-item label="工作负载名">
          <el-input v-model="form.name" placeholder="只能用小写字母、数字、'-'" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="镜像源">
          <el-radio v-model="radio" label="1">我的镜像</el-radio>
          <el-radio v-model="radio" label="2">公共镜像</el-radio>
        </el-form-item>

        <el-form-item label="镜像选择">
          <el-select @click.native="getImage" v-model="form.image" placeholder="请选择镜像">
            <el-option v-for="(item, index) in options" :key="index" :label="item.name + ':' + item.tag" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="暴露容器端口（可选）">
          <el-input v-model="form.port" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :label="'环境变量' + (index + 1)"
          :key="domain.key" :prop="'domains.' + index + '.value'">
          <el-input placeholder="Name" style="width: 30%" v-model="domain.name"></el-input>
          <el-input placeholder="Value" style="width: 30%;margin-left: 20px" v-model="domain.value"></el-input>
          <el-button style="margin-left: 20px" @click.prevent="addDomain(domain)">增加</el-button>
          <el-button v-if="index !== 0" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="newDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="uploadDeployment()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped></style>