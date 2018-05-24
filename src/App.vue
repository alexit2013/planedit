<template>
  <div id="app">
    <div class="header_bg navbar navbar-static-top">
      <div class="container">
        <!-- Logo -->
        <div class="navbar-header">
          <a href="/B30Purchase" class="navbar-brand">优E+</a>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
              <i class="fa fa-bars"></i>
          </button>
        </div>
        <!-- 按钮 -->
        <div v-if="userList" class="collapse navbar-collapse" id="navbar-collapse" aria-expanded="false" style="height: 1px;">
            <ul class="nav navbar-nav">
                <li><a href="/B30Purchase/PurchasePlan">采购计划</a></li>
                <li><a href="/B30Purchase/CatalogueList">商品目录管理</a></li>
                <li><a href="/B30Purchase/VenderList">供应商管理</a></li>
            </ul>
            <!-- 右侧登录信息 -->
             <ul class="nav navbar-nav navbar-right">
                <li class="incname">
                  <a href="javascript:;">{{userList.incname}}</a>
                </li>
                <li class="dropdown user">
                  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                    <span>{{userList.mobile}}</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <div class="lf">
                         <a href="/Account/User_Center" class="btn btn-default">账户</a>
                      </div>
                     <div class="rf">
                       <a href="/Account/Logout" class="btn btn-default">退出</a>
                     </div>
                    </li>
  
                  </ul>
                </li>
              </ul>
        </div>
        
   
      </div>
    </div>
    <div class="content container">
      <!-- 面包屑导航 -->
      <div class="row bread">
        <p class="lf title">采购计划详情</p>
        <ul class="breadcrumb rf">
          <li>
            <i class="fa fa-home"></i>
            <a href="javascript:;">首页</a>
          </li>
          <li>
            <a href="javascript:;">采购计划</a>
          </li>
          <li>
            <a href="javascript:;">采购计划编辑</a>
          </li>
        </ul>
      </div>
      <!-- 搜索 -->
      <div class="search form-inline">
          <div class="form-group " >
            <label for="goods">商品</label>
            <input v-model.trim="productName" @keyup.enter="planSearch" type="text" class="form-control" id="goods" placeholder="通用名、商品名、ERP编号">
          </div>
          <div class="form-group">
            <label for="factory">厂家</label>
            <input v-model.trim="factoryName" @keyup.enter="planSearch" type="email" class="form-control" id="factory" placeholder="生产厂家">
          </div>
          <button type="button" @click="planSearch" class="btn btn-default"><i class="fa fa-search"></i>计划内</button>
          <button type="button" @click="qjSearch" class="btn btn-primary" data-toggle="modal" data-target="#qjSearch">
            <i class="fa fa-search-plus"></i>全局
          </button>
      </div>
      <!-- 采购内容 -->
      <div class="box">
        <!-- 采购内容头部筛选/排序... -->
        <div class="box_header row">
          <!-- 左侧勾选排序 -->
          <div class="check col-xs-12 col-md-6" v-if="list">
            <p>
              <input type="checkbox" @change="changeShowCanBuy($event)" v-model="showCanBuy">仅显示可采<span>{{list.data.CountPurchase}}</span>
            </p>
            <p>
              <input type="checkbox" @change="changeOverStock($event)" v-model="OverStock" >采购超库存 <span>{{list.data.CountPurchaseSock}}</span>
            </p>
            <p>
              <input type="checkbox" @change="changePurchaseSpxq($event)" v-model="PurchaseSpxq">近效期(1年以内) <span>{{list.data.CountSpxq}}</span>
            </p>
            <p>
              <input type="checkbox" @change="changePriceChange($event)"  v-model="PriceChange">价格变动 <span>{{list.data.CountPriceChange}}</span>
            </p>
            <p>
              <button class="btn btn-default" data-toggle="modal" data-target="#cg_filter">
                <i class="fa fa-filter"></i>
                筛选
                <span class="filter_num label label-danger"></span>
              </button>
            </p>
            <p class="dropdown">
              <button class="btn btn-default" data-toggle="dropdown">
                <i class="fa fa-sort"></i>
                排序
              </button>
              <ul class="sort dropdown-menu">
                <li class="active" @click="defaultSort($event)">
                  <a href="javascript:;">默认排序</a>
                </li>
                <li data-num='1' @click="zjSort($event)">
                  <a href="javascript:;">按参考价同供应价 <b>总价</b> 差额排序<i style="margin-left:6px;" class=""></i></a>
                </li>
                <li data-num='1' @click="djSort($event)">
                  <a href="javascript:;">按参考价同供应价 <b>单价</b> 差额排序<i style="margin-left:6px;" class=""></i></a>
                </li>
                <li data-num='1' @click="countSort($event)">
                  <a href="javascript:;">按采购数量排序<i style="margin-left:6px;" class=""></i></a>
                </li>
              </ul>
            </p>
          </div>
          <!-- 右侧按钮选择排序 -->
          <div class="shortcut text-right col-xs-12 col-md-6">
            <button @click="reset" class="btn btn-info glyphicon glyphicon-refresh">重置</button>
            <button data-toggle="modal" data-target="#cg_preference"  class="btn btn-primary glyphicon glyphicon-cog">采购偏好</button>
            <button @click="chooseLow" class="btn btn-primary glyphicon glyphicon-check">全选最低价</button>
            <button @click="addStore" data-toggle="modal"  data-target="#addStore" class="btn btn-primary glyphicon glyphicon-plus">添加匹配店铺</button>
            <button class="upload btn btn-primary glyphicon glyphicon-plus">导入计划
              <input @change="upLoad($event)" type="file"/>
            </button>
          </div>
        </div>
        <!-- 采购详情表格 -->
        <div class="detail">
          <!-- 采购详情头部/滚动时固定在顶部 -->
          <div class="container fixed_top">
          <table class=" table table-bordered" v-if="list">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" @click="selectAll($event)" class="checkall" vale="all" v-model="checkall" >
                </th>
                <th>商品</th>
                <th>
                  库存信息
                  <ul class="clear">
                    <li class="lf">库存</li>
                    <li class="lf">月销</li>
                    <li class="lf">参考价</li>
                  </ul>
                </th>
                <th>
                  采购数量
                </th>
                <th class="dropdown td_supplier" v-for="(item,index) in list.data.purchasingCompanyList" :key="index">
                  <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">{{item.CompanyName.slice(0,6)}}</a>
                  <div :class="{'offline':!item.isOnline,'online':item.isOnline}" class="total_price text-center" title="小计">{{'￥'+item.Total.toFixed(2)}}</div>
                  <div class="dropdown-menu">
                    <h5>{{item.CompanyName}}</h5>
                    <span class="sign" v-if="item.isOnline">线上</span>
                    <span class="sign_offlilne" v-else>线下</span>
                    <label>最低价/匹配/总商品</label>
                    <p style="text-align:left">{{item.minPriceCount+'/'+item.MatchingCount+'/'+item.Count}}</p>
                    <a href="javascript:;">
                      <button @click="cancelMatch(index)" v-if="item.Enabled" class="btn btn-block btn-danger">取消匹配</button>
                      <button @click="startMatch(index)" v-else class="btn btn-block btn-danger">启用匹配</button>
                    </a>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
          </div>
          <!-- 采购详情内容 -->
          <table class="product_container table table-bordered table-hover">
            <tbody v-if="productList.length>0">
              <tr v-for="(product,ind) in productList" :key="ind" :class="{'no_product':!product.canBuy}">
                <td>
                  <input type="checkbox" @click="selectOne($event,ind)" v-model="product.isSelect" :disabled="!product.canBuy">
                </td>
                <!-- 商品名称列 -->
                <td class="text-right" data-toggle="popover" data-placement="bottom" :data-content="product.marks">
                  <b>{{product.DrugsBase_DrugName}}</b>
                  <span class="label label-info" v-if="product.BranchesCount>0">多门店</span>
                  <span  class='label label-warning' v-if="product.Goods_ID==0">未关联</span>
                  <span class="label label-success" v-if="product.source==1" data-toggle="tooltip" data-placement="left" title="搜索添加商品">
                    <i class="fa fa-search-plus"></i>
                  </span>
                  <i class="marks" v-if="product.marks!=''"></i>
                  <p><span>{{product.DrugsBase_Specification}}</span> - {{product.DrugsBase_Manufacturer}}</p>
                  <p v-show="product.Recent_supplier">最近采购：{{product.Recent_supplier}}</p>
                </td>
                <!-- 库存 -->
                <td>{{product.Stock}}</td>
                <!-- 月销 -->
                <td>{{product.MonthlySales}}</td>
                <!-- 参考价 -->
                <td :class="{high:product.Price-product.HistoryPrice<0,low:product.Price-product.HistoryPrice>0}">
                  <span>{{product.HistoryPrice}}</span>
                  <p class="price_diff" v-if="product.HistoryPrice>0">
                    <i class="fa" :class="{'fa-caret-up':product.Price-product.HistoryPrice<0,'fa-caret-down':product.Price-product.HistoryPrice>0}"></i>
                    <span>{{Math.abs((product.Price-product.HistoryPrice).toFixed(2))}}</span>
                  </p>
                  <p v-else>0</p>
                </td>
                <!-- 采购数量 -->
                <td>
                  <input type="text" :readonly="product.BranchesCount>0" class="form-control" @focus="showBranchesModal($event,ind)" @change="buyCountChange($event,ind)" :class="{'out_top':product.outTop1}" v-model.number="product.BuyCount" :disabled="!product.canBuy">
                </td>
                <!-- 药企对应商品 -->
                <td v-for="(item,key) in product.sellerJson1"  :key="key" class="td_supplier text-right" :class="{success:item,not_selected:!item||!item.selected,not_allowd:!item||!item.canSelect}">
                  <!-- 有商品 -->
                  <div v-if="item" @click.stop="product_choose(ind,key,product.BuyCount,item.price)">
                    <i class="icon" v-show="item.selected" @click.stop="cancel_select(ind,key,product.BuyCount,item.price)">
                      <span class="fa fa-check"></span>
                    </i>
                    <p v-if="item.bargain>0">
                      <span class="label label-warning">议</span>
                      {{item.bargain}}
                    </p>
                    <span class="price" style="color:#5cb85c">{{item.price.toFixed(2)}}</span>
                    <div class="info">
                      <p>库存 {{item.stock}}</p>
                      <p>效期 <span class="spxq" :class="{'overdue':item.overdue}">{{item.spxq.slice(2)||'-'}}</span></p>
                    </div>
                  </div>
                  <!-- 无商品 -->
                  <div v-else>
                    -
                  </div>
                </td>
              
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>


    <!-- 底部统计结算固定条 -->
    <div class="account">
      <div class="account_inner  clear" v-if="list">
        <p class="lf">共&nbsp;<span class="num">{{list.data.ProductCount}}</span>&nbsp;件商品,已选择&nbsp;<span class="num">{{list.data.ProductCountSelect}}</span>&nbsp;件,其中&nbsp;<span>{{list.data.noLinkCount}}</span>&nbsp;件未关联,<a :href="'/B30Purchase/CatalogueList?purchase_id='+id">点击关联</a>&nbsp;&nbsp;&nbsp;合计:<span class="num">￥{{TotalPrice}}</span></p>
        <button @click="submitOrder" class="rf">提交订单</button>
      </div>
    </div>

    <!-- 模态框 -->
    <!-- 1、筛选按钮模态框 -->
    <div class="modal fade" id="cg_filter" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">筛选</h4>
          </div>
          <div class="modal-body">
             <div class="form-group row">
                  <div class="col-sm-3 text-right">选择</div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_select" value="0">全部</label>
                    <label><input type="radio" name="filter_select" value="1"> 已选择</label>
                    <label><input type="radio" name="filter_select" value="2"> 未选择</label>
                  </div>
              </div>
              <div class="form-group row">
                  <div class="col-sm-3 text-right">价格</div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_pricetype" value="0">全部</label>
                    <label><input type="radio" name="filter_pricetype" value="1"> 参考价高于供价</label>
                    <label><input type="radio" name="filter_pricetype" value="2"> 参考价低于供价</label>
                  </div>
              </div>
              <div class="form-group row">
                  <div class="col-sm-3 text-right">添加类型</div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_source" value="0">全部</label>
                    <label><input type="radio" name="filter_source" value="1"> 导入</label>
                    <label><input type="radio" name="filter_source" value="2"> 搜索添加</label>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="cancel btn btn-default" data-dismiss="modal">清除筛选</button>
            <button type="button" class="post btn btn-primary">筛选</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 2、采购偏好模态框 -->
    <div class="modal fade" id="cg_preference" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">采购偏好设置</h4>
          </div>
          <div v-if="list" class="modal-body">
              <div class="form-group row">
                  <label class="col-sm-4">相同价格：</label>
                  <div class="col-sm-8">
                      <label class="input"><input :checked="list.data.PriceEqual==1" class="icheck" name="habit" type="radio" value="1"> 长账期优先</label>
                      <span data-toggle="tooltip" title class="fa fa-question-circle" data-placement="top" data-original-title="价格相同，优先选择账期更长的供应商"></span>
                      <br>
                      <label class="input"><input :checked="list.data.PriceEqual==2" class="icheck" name="habit" type="radio" value="2"> 大采购量优先</label>
                      <span data-toggle="tooltip" title="" class="fa fa-question-circle" data-original-title="价格相同，优先选择采购金额更高的供应商"></span>
                  </div>
              </div>
              <div class="form-group row">
                  <label class="col-sm-4">效期、库存规则：</label>
                  <div class="col-sm-8">
                      <label class="input"><input :checked="!list.data.IsMatchJxq" @click="changeIsMatchJxq($event)" type="checkbox" name="IsJxq"> 近效期不选（一年以内）</label> <span data-toggle="tooltip" title="" class="fa fa-question-circle" data-original-title="不选择近效期商品"></span>
                      <br>
                      <label class="input"><input :checked="!list.data.IsMatchNotStock" @click="changeIsMatchNotStock($event)" type="checkbox" name="IsNoStock"> 库存不足不选</label> <span data-toggle="tooltip" title="" class="fa fa-question-circle" data-original-title="不选库存不满采购量的供应商"></span>
                  </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="post btn btn-primary">保存</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 3、议价模态框 -->
    <div style="display:none;" class="yjModal">
      <div class="yjBody">
        <h4 class="title">填写议价
          <span class="rf shut">&times;</span>
        </h4>
        <div class="yjContent">
          <p class="row">
            <span class="left col-xs-4">供应商</span>
            <span class="right companyName col-xs-8">四川仁通医药有限公司</span>
          </p>
          <p class="row">
            <span class="left col-xs-4">价格</span>
            <span class="right price col-xs-8">4.2</span>
          </p>
          <p class="row">
            <span class="left col-xs-4">参考价</span>
            <span class="right historyPrice col-xs-8">0</span>
          </p>
          <p class="row">
            <span class="left col-xs-4">议价</span>
            <span class="right col-xs-8">
              <input style="width:100px;" class="right input form-control col-xs-8" type="number"/>
            </span>  
          </p>
        </div>
        <div class="yjFooter">
          <button class="shut btn btn-default">取消</button>
          <button class="post btn btn-primary">保存</button>
        </div>
      </div>
    </div>
    <!-- 4、多门店模态框 -->
    <div class="branchesModal" style="display:none">
      <div class="branchesBody">
        <h4 class="title">多门店采购数量修改
          <span class="rf shut">&times;</span>
        </h4>
        <div class="branchesContent">
          <p class="row">
            <span class="left col-xs-4">成华店</span>
            <span class="right col-xs-8">
              <input style="width:100px;" class="input form-control" type='number'/>
            </span>
          </p>
          <p class="row">
            <span class="left col-xs-4">成华店</span>
            <span class="right col-xs-8">
              <input style="width:100px;" class="input form-control" type='number'/>
            </span>
          </p>
          <p class="row">
            <span class="left col-xs-4">总计</span>
            <span class="right total col-xs-8">4</span>
          </p>
        </div>
        <div class="branchesFooter">
          <button class="shut btn btn-default">取消</button>
          <button class="post btn btn-primary">保存</button>
        </div>
      </div>
    </div>
    <!-- 5、加载中loading图 -->
    <div v-if="showLoading" class="loading">
      <img src="./assets/img/loading-0.gif"/>
    </div>
    <!-- 6、添加匹配店铺模态框 -->
    <div class="modal fade" id="addStore" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" @click="closeAddStore" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">添加匹配店铺</h4>
          </div>
          <div class="modal-body">
            <div class="form-inline" style="margin-bottom:20px;">
               <div class="form-group">
                    <label for="">供应商</label>
                    <input v-model.trim="VenderName" class="form-control"  placeholder="供应商名称" type="text" >
                </div>
                <div class="form-group">
                    <button @click="searchCompany" class="btn btn-default">搜索</button>
                </div>
            </div>
            <table class="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>供应商</th>
                  <th>商品数</th>
                  <th>操作</th>
                </tr>  
              </thead>
              <tbody v-if="CompanyList.length>0">
                <tr v-for="(item,key) in CompanyList" :key="key">
                  <td>{{item.venderename}}</td>
                  <td>{{item.pcount}}</td>
                  <td>
                    <button @click="addCompany(key)" v-if="!item.IsVendor" class="btn btn-primary">加入匹配</button>
                    <button @click="removeCompany(key)" v-else class="btn btn-danger">取消匹配</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 7、全局商品搜索模态框 -->
    <div class="modal fade" data-backdrop="static" data-keyboard="false" id="qjSearch" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div style="width:900px;" class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" @click="closeQjSearch" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">搜索商品</h4>
          </div>
          <div class="modal-body">
            <iframe src="" style="width:100%;height:600px;border-style:none;" frameborder="0"></iframe>
          </div>
          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div> -->
        </div>
      </div>
    </div>

     <!-- 8、提交订单确认模态框 -->
    <div class="orderConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="closeOrder" class="shut rf">&times;</span>
        </h4>
        <p class="info" v-if="list">有&nbsp;{{list.data.CountPurchaseSock}}&nbsp;个品种超出了库存数量，不能提交订单。</P>
        <p class="text-right">
          <button @click="closeOrder" class="btn btn-primary">确定</button>
          <button @click="checkOverStock" class="btn btn-default">查看</button>
        </p>
      </div>
    </div>
    <!-- 9、请选择要购买的品种 -->
    <div style="display:none;" class="pleaseSelect">
      请选择要购买的品种
    </div>
    <!-- 10、通用toast -->
    <div style="display:none;" class="myToast">
      提示
    </div>
    <!-- 11、通用确认框 -->
    <div class="changeConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="closeChange" class="shut rf">&times;</span>
        </h4>
        <p class="info">正在重新生成采购计划</P>
        <p class="text-right">
          <button @click="closeChange" class="btn btn-default">确定</button>
        </p>
      </div>
    </div>
    <!-- 12、是否重置页面 -->
    <div class="refreshConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="cancelRefresh" class="shut rf">&times;</span>
        </h4>
        <p class="info">重置所有操作,是否继续?</P>
        <p class="text-right">
          <button @click="cancelRefresh" class="btn btn-primary">取消</button>
          <button @click="goRefresh"  class="btn btn-default">确定</button>
        </p>
      </div>
    </div>
    <!-- 13、返回登录页面确认框 -->
    <div class="loginConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="toLogin" class="shut rf">&times;</span>
        </h4>
        <p class="info">未登录,请先登录!</P>
        <p class="text-right">
          <button @click="toLogin" class="btn btn-default">确定</button>
        </p>
      </div>
    </div>
    <!-- 14、重置刷新确认框 -->
    <div class="uploadDoneConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="closeUploadConfirm" class="shut rf">&times;</span>
        </h4>
        <p class="info">导入成功,即将刷新采购计划</P>
        <p class="text-right">
          <button @click="closeUploadConfirm" class="btn btn-default">确定</button>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "App",
  components: {},
  data() {
    return {
      id: 0,
      sorting: 0, //排序按钮点击对应的值
      factoryName: "",
      productName: "",
      showLoading: false,
      showYj: false,
      checkall: true,
      // filterCondition:{
      //   showCanBuy:true,
      //   OverStock:false,//是否勾选采购超库存
      //   PurchaseSpxq:false,//是否勾选上近效期
      // },
      showCanBuy: true, //是否显示可采
      OverStock: false, //是否勾选采购超库存
      PurchaseSpxq: false, //是否勾选上近效期
      PriceChange: false, //是否显示价格变动
      filter_select: 0, //筛选全部/已选择/未选择
      filter_pricetype: 0, //筛选价格 0全部 1 参考价高于供价 2 参考价低于供价
      filter_source: 0, //过滤品种来源 1 导入，2搜索添加
      VenderName: "", //添加店铺模态框中的搜索店铺输入框绑定
      productList: [],
      CompanyList: [],
      list: null,
      userList:null,
      isLogin:false,
    };
  },
  created() {
    //console.log(this.list);
    //获取用户登录信息
    this.$http.post('/WebApi/GetUserInfo').then(res=>{
      if(res.data.success){
        this.userList=res.data.data;
        this.isLogin=true;
      }else{
        location.href="/home/index";
      }
    }).catch(err=>{
      this.myConfirm('网络错误,无法获得登录信息!');
    })

    this.id = location.search.slice(4);
    this.getData();

    //默认只显示可采
    // this.productList=this.list.data.productList.filter((ele,i)=>{
    //   var res=ele.sellerJson1.some((item,idx)=>{
    //     return item!=undefined;
    //   });
    //   return res;
    // });
    // this.productList.forEach((ele,i)=>{
    //   ele.BranchesJson=JSON.parse(ele.BranchesJson);
    // })
    //this.purchasingCompanyList=this.list.data.purchasingCompanyList;

    //console.log(this.list);
  },
  mounted() {
    //已选中商品右上角图标切换
    $(".product_container").on("mouseenter", ".icon", function() {
      $(this)
        .addClass("red")
        .children()
        .css({
          top: -8,
          right: -6
        })
        .attr("class", "fa fa-close");
    });
    $(".product_container").on("mouseleave", ".icon", function() {
      $(this)
        .removeClass("red")
        .children()
        .css({
          top: -12,
          right: -10
        })
        .attr("class", "fa fa-check");
    });
    //启用tooltip
    $("[data-toggle='tooltip']").tooltip();
    //启用popover
    $("[data-toggle='popover']").popover({
      trigger: "hover",
      container: "body"
    });
    //议价窗口操作
    //1.X关闭
    $(".yjModal").on("click", ".shut", function() {
      var $this = $(this);
      $this.parents(".yjModal").slideUp();
    });
    //.填写议价价格
    $(".yjModal").on("blur", ".input", e => {
      var $this = $(e.target);
      var value = parseFloat($this.val());
      var price = parseFloat($(".yjModal .price").text()); //店铺价格
      if (isNaN(value) || value < 0 || value > price) {
        console.log("店铺价格是"+price);
        $this.val(0);
        this.myToast("请输入合理价格");
        $this.focus();
      } else {
        $(".yjModal .post").data({
          bargain: value
        });
      }
    });
    //3.保存
    $(".yjModal").on("click", ".post", e => {
      var $this = $(e.target);
      // console.log($this.data('productIndex'));
      // console.log($this.data('storeIndex'));
      var productIndex = $this.data("productIndex"),
        storeIndex = $this.data("storeIndex"),
        purchaselistid = $this.data("purchaselistid"),
        storeid = $this.data("storeid"),
        bargain = parseFloat($this.data("bargain"));
      //console.log(bargain);
      this.productList[productIndex].sellerJson1[storeIndex].bargain = bargain;
      if (!isNaN(bargain)) {
        var params = new URLSearchParams();
        params.append("purchaselistid", purchaselistid);
        params.append("storeid", storeid);
        params.append("bargain", bargain);
        this.$http.post("/WebApi/PurchasePlanBargain", params).then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myConfirm(res.data.info);
            }
          }
        });
      } else {
        this.myToast("请设置合理的议价价格!");
        return;
      }
      $(".yjModal .input").val("");
      $(".yjModal .shut").click();
    });

    //多门店购买数量修改
    var $branchesModal = $(".branchesModal");
    //点击关闭
    $branchesModal.on("click", ".shut", function() {
      var $this = $(this);
      $this.parents(".branchesModal").slideUp();
    });
    //input值改变
    $branchesModal.on("change", ".input", e => {
      var $this = $(e.target),
        value = parseInt($this.val()),
        productIndex = $(".branchesModal .post").data("productIndex"),
        branchesIndex = $this.data("branchesindex");
      //console.log(branchesIndex);
      if (value < 0 || isNaN(value)) {
        this.myToast("请输入正确的采购数量");
        value = 0;
        $this.val(0);
      }
      //productList中的BranchesJson数组更新
      this.productList[productIndex].BranchesJson[
        branchesIndex
      ].BuyCount = value;

      //模态框中的采购数量小计
      var total = 0;
      $(".branchesModal .input").each(function(i, ele) {
        var $this = $(ele);
        total += parseInt($this.val());
      });
      // console.log(total);
      $branchesModal.find(".total").text(total);
    });

    //多门店修改提交
    $branchesModal.on("click", ".post", e => {
      var $this = $(e.target),
        productIndex = $this.data("productIndex"),
        total = parseInt($branchesModal.find(".total").text());
      this.productList[productIndex].BuyCount = total;
      var buyCount0 = this.productList[productIndex].BuyCount0;

      //小计更新
      if (total > buyCount0) {
        //修改后数量增加
        var ce = parseInt(total - buyCount0);
        //console.log(this.productList[productIndex].sellerJson1);
        this.productList[productIndex].sellerJson1.forEach((ele, i) => {
          if (ele && ele.prevSelected) {
            this.list.data.purchasingCompanyList[i].Total += ce * ele.price;
          }
        });
      } else if (total < buyCount0) {
        //修改后数量减少
        var ce = parseInt(buyCount0 - total);
        this.productList[productIndex].sellerJson1.forEach((ele, i) => {
          if (ele && ele.prevSelected) {
            this.list.data.purchasingCompanyList[i].Total -= ce * ele.price;
          }
        });
      }
      this.productList[productIndex].BuyCount0 = total;
      //超库存数量更新
      var stock = 0; //选中商品的库存数量
      this.productList[productIndex].sellerJson1.forEach((ele, i) => {
        if (ele && ele.selected) {
          stock = ele.stock;
        }
      });
      if (total > stock) {
        //超过库存
        //console.log(total+"新数量超过库存");
        if (!this.productList[productIndex].outTop1) {
          //之前没有超库存
          //console.log("并且之前没有超库存");
          this.list.data.CountPurchaseSock++;
          this.productList[productIndex].outTop0 = true;
          this.productList[productIndex].outTop1 = true;
        }
      } else if (total <= stock) {
        //小于库存
        //console.log(total+'新数量没有超过库存');
        if (this.productList[productIndex].outTop1) {
          //之前超库存
          //console.log('并且之前超库存');
          this.list.data.CountPurchaseSock--;
          this.productList[productIndex].outTop0 = false;
          this.productList[productIndex].outTop1 = false;
        }
      }
      //向服务器发送多门店采购修改数量
      //生成{商品ID:购买数量}格式数据
      var params = new URLSearchParams();
      $(".branchesModal .input").each(function(i, ele) {
        var $this = $(ele);
        var id = $this.data("id"),
          value = $this.val();
        // obj[id]=value;
        params.append(id, value);
      });
      //console.log(obj);
      this.$http
        .post("/WebApi/PurchasePlanModifyBranchesBuyCount", params)
        .then(res => {
          if (!res.data.success) {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myConfirm(res.data.info);
            }
          }
        })
        .catch(err => {
          //console.log(err);
          this.myConfirm("网络错误,请重试!");
        });
      //向服务器发送修改后的总数
      this.$http
        .post("/WebApi/PurchasePlanModifyBuyCount", {
          id: this.productList[productIndex].id,
          BuyCount: total
        })
        .then(res => {
          if (!res.data.success) {
            this.myToast(res.data.info);
          }
        })
        .catch(err => {
          //console.log(err);
          this.myToast("网络错误,请重试");
        });

      $(".branchesModal .shut").click();
    });

    //采购偏好设置提交按钮
    $("#cg_preference .post").click(e => {
      //清除之前的筛选条件
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");

      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.showCanBuy = true;
      this.OverStock = false;
      this.PurchaseSpxq = false;
      this.PriceChange = false;
      this.sorting = 0;
      $(".box_header ul.sort li").each((i, ele) => {
        var $that = $(ele);
        $that.removeClass("active");
        if ($that.find("i").length > 0) {
          $that.find("i").attr("class", "");
        }
      });
      $(".box_header ul.sort li:first").addClass("active");

      var $this = $(e.target);
      var IsNoStock = Number(
        !$("#cg_preference input[name='IsNoStock']").is(":checked")
      );
      var IsJxq = Number(
        !$("#cg_preference input[name='IsJxq']").is(":checked")
      );
      var habit =
        Number($("#cg_preference input[name='habit']:checked").val()) || 0;
      var params = new URLSearchParams();
      params.append("PurchaseId", this.id);
      params.append("IsNoStock", IsNoStock);
      params.append("IsJxq", IsJxq);
      params.append("habit", habit);
      this.showLoading = true;
      this.$http
        .post("/WebApi/PurchasePerferenceSett", params)
        .then(res => {
          if (res.data.success) {
            //this.list=res.data;
            this.$http
              .post("/WebApi/PurchaseEditRefresh", {
                id: this.id
              })
              .then(res => {
                if (res.data.success) {
                  this.list = res.data;
                  console.log(this.list);
                  this.showLoading = false;
                } else {
                  this.showLoading = false;
                  if(res.data.info=="请先登录"){
                    $('.loginConfirm').fadeIn();
                  }else{
                    this.myConfirm(res.data.info);
                  }
                }
              })
              .catch(err => {
                his.showLoading = false;
                this.myConfirm("网络错误,请重试!");
              });
          } else {
            this.showLoading = false;
            this.myConfirm(res.data.info);
          }
        })
        .catch(err => {
          this.showLoading = false;
          this.confirm("网络错误,请重试");
        });
      $("#cg_preference").modal("hide");
    });

    //筛选
    //1.筛选提交按钮
    $("#cg_filter .post").click(e => { 
      //筛选数量
      var count = 0;
      var filter_select = Number(
        $("#cg_filter input[name='filter_select']:checked").val()
      );
      this.filter_select = filter_select;
      if (filter_select > 0) count++;
      var filter_pricetype = Number(
        $("#cg_filter input[name='filter_pricetype']:checked").val()
      );
      this.filter_pricetype = filter_pricetype;
      if (filter_pricetype > 0) count++;
      var filter_source = Number(
        $("#cg_filter input[name='filter_source']:checked").val()
      );
      this.filter_source = filter_source;
      if (filter_source > 0) count++;
      var $label = $(".box_header .filter_num");
      if (count > 0) {
        $label.text(count);
        //请求数据
        this.showLoading = true;
        this.$http
          .post("/WebApi/getlist", {
            id: this.id,
            type: Number(this.showCanBuy),
            OverStock: Number(this.OverStock),
            PurchaseSpxq: Number(this.PurchaseSpxq),
            PriceChange: Number(this.PriceChange),
            filter_select,
            filter_pricetype,
            filter_source
          })
          .then(res => {
            if (res.data.success) {
              this.list = res.data;
            } else {
              if(res.data.info=="请先登录"){
                $('.loginConfirm').fadeIn();
              }else{
                this.myConfirm(res.data.info);
              }
            }
            this.showLoading = false;
          })
          .catch(err => {
            this.myConfirm("网络错误,请重试");
            this.showLoading = false;
          });
      } else {
        $label.text("");
      }

      $("#cg_filter").modal("hide");
    });
    //2.清除筛选按钮
    $("#cg_filter .cancel").on("click", e => {
      //console.log(e.target);
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");
      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      //请求数据
      this.showLoading = true;
      this.$http
        .post("/WebApi/getlist", {
          id: this.id,
          type: Number(this.showCanBuy),
          OverStock: Number(this.OverStock),
          PurchaseSpxq: Number(this.PurchaseSpxq),
          PriceChange: Number(this.PriceChange),
          sorting: this.sorting,
          filter_select: 0,
          filter_pricetype: 0,
          filter_source: 0
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myConfirm(res.data.info);
            }
          }
          this.showLoading = false;
        })
        .catch(err => {
          this.myConfirm("网络错误,请重试");
          this.showLoading = false;
        });
    });

    //页面滚动时让fixed_top固定在顶部
    var $fixed_top = $(".fixed_top");
    var offsetTop = $fixed_top.offset().top;
    $(window).scroll(function() {
      //console.log('正在滚动')
      if ($(this).scrollTop() > offsetTop) {
        $fixed_top.css({
          position: "fixed",
          top: 0
        });
      } else {
        $fixed_top.css({
          position: "static"
        });
      }
    });
  },
  updated() {
    //启用tooltip
    $("[data-toggle='tooltip']").tooltip();
    //启用popover
    $("[data-toggle='popover']").popover({
      trigger: "hover",
      container: "body"
    });
  },
  methods: {
    //请求数据函数
    getData() {
      this.showLoading = true;
      this.$http
        .post("/WebApi/getlist", {
          id: this.id,
          type: Number(this.showCanBuy),
          OverStock: Number(this.OverStock),
          PurchaseSpxq: Number(this.PurchaseSpxq),
          PriceChange: Number(this.PriceChange),
          sorting: this.sorting,
          filter_select: this.filter_select,
          filter_pricetype: this.filter_pricetype,
          filter_source: this.filter_source
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
            this.showLoading = false;
            console.log(this.list);
            //如果价格或者店铺数量发生变化,重新请求数据
            if (res.data.data.isCompanyChange || res.data.data.isChange) {
              this.showLoading = true;
              var params = new URLSearchParams();
              params.append("id", this.id);
              if (res.data.data.isChange) {
                params.append("PriceChange", 1);
                this.myConfirm("卖家价格发生变化,正在更新采购计划中变化的价格");
              } else {
                this.myConfirm("采购的卖家数量发生变动,正在重新生成采购计划");
              }
              this.$http
                .post("/WebApi/ChangePurchasePlan", params)
                .then(res => {
                  if (res.data.success) {
                    //重新计算成功,在次重新请求数据
                    this.$http
                      .post("/WebApi/getlist", {
                        id: this.id,
                        type: Number(this.showCanBuy),
                        OverStock: Number(this.OverStock),
                        PurchaseSpxq: Number(this.PurchaseSpxq),
                        PriceChange: Number(this.PriceChange),
                        sorting: this.sorting,
                        filter_select: this.filter_select,
                        filter_pricetype: this.filter_pricetype,
                        filter_source: this.filter_source
                      })
                      .then(res => {
                        this.showLoading = false;
                        if (res.data.success) {
                          this.list = res.data;
                        } else {
                          this.myToast(res.data.info);
                        }
                      })
                      .catch(err => {
                        this.showLoading = false;
                        this.myToast("网络错误,请重试!");
                      });
                  } else {
                    this.showLoading = false;
                    this.myToast(res.data.info);
                  }
                })
                .catch(err => {
                  this.showLoading = false;
                  this.myToast("网络错误,请重试!");
                });
            }
          } else {
            if(res.data.info=="请先登录"){
              this.showLoading = false;
              $('.loginConfirm').fadeIn();
            }else{
              this.showLoading = false;
              this.myToast(res.data.info);
            }
            
          }
        })
        .catch(error => {
          this.showLoading = false;
          this.myToast("网络错误,请重试!");
          //console.log(error);
          //console.log("created中请求数据失败");
        });
    },
    //重新计算productList,使其sellerJson1数组长度等于商家个数,便于v-for循环
    resetProductList() {
      var len = this.list.data.purchasingCompanyList.length;
      this.productList.forEach((ele, index, arr) => {
        ele.BuyCount0 = ele.BuyCount;
        ele.BranchesJson = JSON.parse(ele.BranchesJson);
        var output = [];
        output.length = len;
        for (var i = 0; i < len; i++) {
          var companyId = this.list.data.purchasingCompanyList[i].storeid;
          var canSelect = this.list.data.purchasingCompanyList[i].Enabled;
          for (var j = 0, canBuy = 0; j < ele.sellerJson1.length; j++) {
            if (ele.sellerJson1[j] != undefined) {
              var productId = ele.sellerJson1[j].storeid;
              canBuy++;
            } else {
              var productId = 0.0001;
            }
            if (productId == companyId) {
              ele.sellerJson1[j].canSelect = canSelect;
              output[i] = ele.sellerJson1[j];
              output[i].prevSelected = output[i].selected ? true : false;
              //此商品购买数量>商家的库存数量 标识outTop1
              if (output[i].selected && ele.BuyCount > output[i].stock) {
                ele.outTop0 = true;
                ele.outTop1 = true;
              } else if (output[i].selected) {
                ele.outTop0 = false;
                ele.outTop1 = false;
              }
            }
          }
          ele.canBuy = canBuy > 0 ? true : false;
        }

        ele.sellerJson1 = output;
      });
    },
    chooseLow() {
      //清楚筛选条件
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");

      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.showCanBuy = true;
      this.OverStock = false;
      this.PurchaseSpxq = false;
      this.PriceChange = false;
      this.sorting = 0;
      $(".box_header ul.sort li").each((i, ele) => {
        var $this = $(ele);
        $this.removeClass("active");
        if ($this.find("i").length > 0) {
          $this.find("i").attr("class", "");
        }
      });
      $(".box_header ul.sort li:first").addClass("active");

      this.showLoading = true;
      this.$http
        .post("/WebApi/PurchasePlanSelectMiniPirce", {
          id: this.id,
          type: 1
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
          this.showLoading = false;
        })
        .catch(err => {
          this.showLoading = false;
          this.myConfirm("网络错误,请重试!");
        });
    },
    //计算商品效期是否标红显示(近效期一年以内标红)  无用
    overdue(spxq) {
      var time = new Date();
      time.setFullYear(time.getFullYear() + 1);
      var product_spxq = new Date(spxq);
      if (product_spxq - time > 0) return false;
      else return true;
    },
    //采购数量超出选中产品的库存,超出库存则标红    无用
    outTop(ind) {
      //this.productList.BuyCount;
      var stock = null;
      //console.log(this.productList);
      this.productList[ind].sellerJson1.forEach((ele, i) => {
        if (ele && ele.prevSelected) {
          stock = ele.stock;
          // console.log(stock);
        }
      });
      if (stock != null && this.productList[ind].BuyCount > stock) {
        this.productList[ind].outTop = true;
        return true;
      } else {
        this.productList[ind].outTop = false;
        return false;
      }
    },
    //点击X号取消选择
    /**@augments
     * ind产品下标
     * key产品中供应商对应产品下标
     * buyCount购买数量
     * price单价
     */
    cancel_select(ind, key, buyCount, price) {
      this.productList[ind].sellerJson1[key].selected = false;
      this.productList[ind].sellerJson1[key].prevSelected = true;
      this.productList[ind].isSelect = false;
      this.checkall = false;
      if (this.productList[ind].outTop1) {
        this.productList[ind].outTop0 = true;
        this.productList[ind].outTop1 = false;
        this.list.data.CountPurchaseSock--;
      }
      //计算近效期
      if (this.productList[ind].sellerJson1[key].overdue)
        this.list.data.CountSpxq--;
      //计算小计
      var buyCount = this.productList[ind].BuyCount,
        price = this.productList[ind].sellerJson1[key].price;
      // console.log(buyCount,price);
      // console.log('之前的小计'+this.list.data.purchasingCompanyList[key].Total);
      this.list.data.purchasingCompanyList[key].Total -= buyCount * price;
      // console.log('现在的价格'+this.list.data.purchasingCompanyList[key].Total);
      //计算已选择商品-1
      this.list.data.ProductCountSelect--;
      //向服务器发送数据
      var obj = {},
        str = "";
      obj[this.productList[ind].id] = false;
      for (var a in obj) {
        str += a + ":";
        str += false;
      }
      //console.log(str);
      this.$http
        .post("/WebApi/PurchasePlanSetisSelect", {
          data: str
        })
        .then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          this.myConfirm("网络错误,请重试!");
          //console.log(err);
        });
    },
    //点击产品,如果未勾选则勾选且将此商品中,其他供应商商品取消勾选
    /**@augments
     * ind产品下标
     * key产品中供应商对应产品下标
     * buyCount购买数量
     * price单价
     */
    product_choose(ind, key, buyCount, price) {
      //如果是取消匹配下的店铺 直接return
      if (!this.productList[ind].sellerJson1[key].canSelect) return;
      //如果未勾选
      if (!this.productList[ind].sellerJson1[key].selected) {
        var bargain = 0;
        var hasSelect = 0;
        var preSelectIndex = null;
        this.productList[ind].sellerJson1.forEach((ele, i) => {
          if (ele && ele.selected) {
            hasSelect++;
            preSelectIndex = i; //之前选中的商品的下标
          }
          if (i == key) {
            ele.selected = true;
            ele.prevSelected = true;
            this.productList[ind].isSelect = true;
            bargain = ele.bargain;
            //计算重选的商品是否超库存
            if (this.productList[ind].BuyCount > ele.stock) {
              //当前选中的商品库存小于购买数
              if (!this.productList[ind].outTop0 && !ele.offline) {
                this.list.data.CountPurchaseSock++;
                this.productList[ind].outTop0 = true;
                this.productList[ind].outTop1 = true;
              } else if (
                this.productList[ind].outTop0 &&
                !this.productList[ind].outTop1 &&
                !ele.offline
              ) {
                this.list.data.CountPurchaseSock++;
                this.productList[ind].outTop0 = true;
                this.productList[ind].outTop1 = true;
              } else if (ele.offline) {
                this.productList[ind].outTop0 = false;
                this.productList[ind].outTop1 = false;
              }
            } else {
              if (this.productList[ind].outTop0 && !ele.offline) {
                this.list.data.CountPurchaseSock--;
                this.productList[ind].outTop0 = false;
                this.productList[ind].outTop1 = false;
              } else {
              }
            }

            //小计更新
            var price = this.productList[ind].sellerJson1[key].price,
              buyCount = this.productList[ind].BuyCount;
            this.list.data.purchasingCompanyList[key].Total += price * buyCount;
            //更改产品历史价格
            this.productList[ind].Price = price;
          } else {
            if (ele && ele.prevSelected) {
              // bargain=ele.bargain;
              // ele.bargain=0;
              //小计更新
              var price = ele.price,
                buyCount = this.productList[ind].BuyCount;
              this.list.data.purchasingCompanyList[i].Total -= price * buyCount;
            }
            ele.selected = false;
            ele.prevSelected = false;
          }
        });
        if (hasSelect == 0) {
          //之前没有选中的商品
          this.list.data.ProductCountSelect++;
          if (this.productList[ind].sellerJson1[key].overdue) {
            this.list.data.CountSpxq++;
          }
        } else {
          //之前有选中的商品
          //console.log(preSelectIndex);
          if (this.productList[ind].sellerJson1[preSelectIndex].overdue) {
            //之前选中的商品是近效期
            //console.log("之前选中的商品是近效期商品");
            if (!this.productList[ind].sellerJson1[key].overdue)
              this.list.data.CountSpxq--;
          } else {
            if (this.productList[ind].sellerJson1[key].overdue)
              this.list.data.CountSpxq++;
          }
        }
        // this.productList[ind].sellerJson1[key].bargain=bargain;   //转移议价
        //向服务器发送数据选中的商品
        this.$http
          .post("/WebApi/PurchasePlanChangeStoreid", {
            id: this.productList[ind].id,
            storeid: this.list.data.purchasingCompanyList[key].storeid,
            bargain: bargain
          })
          .then(res => {
            if(!res.data.success){
              if(res.data.info=="请先登录"){
                $('.loginConfirm').fadeIn();
              }else{
                this.myToast(res.data.info);
              }
            }
          })
          .catch(err => {
            //console.log(err);
            this.myConfirm("网络错误,请重试!");
          });
        //向服务器发送此商品勾选
        var obj = {},
          str = "";
        obj[this.productList[ind].id] = true;
        for (var a in obj) {
          str += a + ":";
          str += obj[a];
        }
        var params = new URLSearchParams();
        params.append("data", str);
        this.$http
          .post("/WebApi/PurchasePlanSetisSelect", params)
          .then(res => {
            if (!res.data.success) {
              this.myConfirm(res.data.info);
            }
          })
          .catch(err => {
            this.myToast("网络错误,请重试!");
          });
      } else {
        //如果已勾选
        if (this.productList[ind].sellerJson1[key].offline) {
          this.myToast("线上商品才能议价");
          return;
        }

        $(".yjModal .post").data({
          productIndex: ind,
          storeIndex: key,
          purchaselistid: this.productList[ind].id,
          storeid: this.list.data.purchasingCompanyList[key].storeid
        });
        $(".yjModal .companyName").text(
          this.list.data.purchasingCompanyList[key].CompanyName
        );
        //console.log(this.list.data.purchasingCompanyList[key].CompanyName);
        $(".yjModal .price").text(this.productList[ind].sellerJson1[key].price);
        $(".yjModal .historyPrice").text(this.productList[ind].HistoryPrice);

        $(".yjModal").slideDown();
      }
    },
    //不可采产品tr禁用状态,input禁用,设置product的canBuy为false
    noProduct(ind) {
      var res = this.productList[ind].sellerJson1.some((ele, i) => {
        return ele != undefined;
      });
      this.productList[ind].canBuy = res ? true : false;
      return !res;
    },
    //输入采购数量,修正负数,当为负数时取消商品选中
    buyCountChange(e, ind) {
      //console.log("购买数量改变")
      var val = parseInt(e.target.value);
      //console.log(val);
      if (isNaN(val) || val <= 0) {
        val = 1;
        //this.productList[ind].isSelect=false;
      }
      this.productList[ind].BuyCount = val;

      //计算超库存
      var price = null, //选中的商品的价格 供计算小计使用
        pIndex = null; //选中商品对应的药企的下标 供计算小计使用
      this.productList[ind].sellerJson1.forEach((ele, i) => {
        if (ele && ele.selected) {
          price = ele.price;
          pIndex = i;
          var stock = ele.stock; //选中商家的库存数量
          if (val > stock && !this.productList[ind].outTop1) {
            //如果修改后的数量大于选中商品的库存且之前没有超库存
            this.productList[ind].outTop0 = true;
            this.productList[ind].outTop1 = true;
            this.list.data.CountPurchaseSock++;
          } else if (
            this.productList[ind].outTop1 &&
            this.productList[ind].isSelect &&
            val <= stock
          ) {
            this.productList[ind].outTop0 = false;
            this.productList[ind].outTop1 = false;
            this.list.data.CountPurchaseSock--;
          }
        }
      });

      //计算小计
      var buyCount0 = this.productList[ind].BuyCount0; //上次的购买数量
      if (this.productList[ind].isSelect) {
        if (val > buyCount0) {
          //增加
          var ce = val - buyCount0; //差额
          this.list.data.purchasingCompanyList[pIndex].Total += ce * price;
          this.productList[ind].BuyCount0 = val;
        } else if (val < buyCount0) {
          //减少
          var ce = buyCount0 - val;
          this.list.data.purchasingCompanyList[pIndex].Total -= ce * price;
          this.productList[ind].BuyCount0 = val;
        }
      } else {
        this.productList[ind].BuyCount0 = val;
      }

      //向服务器发送数据
      this.$http
        .post("/WebApi/PurchasePlanModifyBuyCount", {
          id: this.productList[ind].id,
          BuyCount: val
        })
        .then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          //console.log(err);
          this.myToast("网络错误,请重试!");
        });
    },
    //点击购买数量输入框,如果是多门店则弹出模态框修改
    showBranchesModal(e, ind) {
      if (
        this.productList[ind].BranchesCount > 0 &&
        this.productList[ind].isSelect
      ) {
        var html = "";
        var arr = this.productList[ind].BranchesJson;
        //console.log(arr.length);
        for (var i = 0; i < arr.length; i++) {
          html += `<p class="row">
            <span class="left col-xs-4">${arr[i].NameBranches}</span>
            <span class="right col-xs-8">
              <input style="width:100px;" data-id=${
                arr[i].id
              } data-branchesindex=${i} value=${
            arr[i].BuyCount
          } class="input form-control" type='number'/>
            </span>
          </p>`;
        }
        html += `<p class="row">
            <span class="left col-xs-4">总计</span>
            <span class="right total col-xs-8">${
              this.productList[ind].BuyCount
            }</span>
          </p>`;
        $(".branchesModal .branchesContent").html(html);
        $(".branchesModal .post").data("productIndex", ind);
        $(".branchesModal").slideDown();
      } else if (this.productList[ind].BranchesCount > 0) {
        e.target.blur();
      }
    },
    //计算小计
    computeXj(index) {
      var count = 0;
      for (var item of this.productList) {
        var buyCount = item.BuyCount;
        if (item.sellerJson1[index] && item.sellerJson1[index].selected) {
          count += buyCount * item.sellerJson1[index].price;
        }
      }
      return count.toFixed(2);
    },
    //商品全选和取消全选,并取消或者选中商品的勾选
    selectAll(e) {
      var obj = {};
      if (!e.target.checked) {
        //计算小计
        // this.list.data.purchasingCompanyList.forEach((ele,i)=>{
        this.productList.forEach((item, ind) => {
          var buyCount = item.BuyCount;
          item.sellerJson1.forEach((product, index) => {
            if (item.isSelect && product && product.selected) {
              //console.log(this.list.data.purchasingCompanyList[index].Total);
              this.list.data.purchasingCompanyList[index].Total = (
                this.list.data.purchasingCompanyList[index].Total -
                buyCount * product.price
              ).toFixed(2);
              this.list.data.purchasingCompanyList[index].Total = Number(
                this.list.data.purchasingCompanyList[index].Total
              );
              //if (item.outTop1) this.list.data.CountPurchaseSock--; //超库存
              if(buyCount>product.stock){
                this.list.data.CountPurchaseSock--;
                item.outTop1=false;
              }
              if (product.overdue) this.list.data.CountSpxq--; //近效期
            }
          });
        });
        // })
        //计算已选择商品数
        var checkNum = 0;
        this.productList.forEach((ele, i) => {
          if (ele.isSelect) checkNum++;
        });
        this.list.data.ProductCountSelect -= checkNum;

        this.productList.forEach((ele, i) => {
          if (ele.canBuy) {
            ele.isSelect = false;
            obj[ele.id] = false;
          }
          ele.sellerJson1.forEach((item, i) => {
            if (item && item.selected) {
              item.prevSelected = true;
            }
            item.selected = false;
          });
        });
      } else {
        this.productList.forEach((item, ind) => {
          var buyCount = item.BuyCount;
          item.sellerJson1.forEach((product, index) => {
            if (product.canSelect && product.prevSelected && !item.isSelect) {
              var stock=product.stock;
              this.list.data.purchasingCompanyList[index].Total += buyCount * product.price;
              //if (item.outTop1) this.list.data.CountPurchaseSock++; 
              if(buyCount>stock){//超库存
                this.list.data.CountPurchaseSock++;
                item.outTop0=true;
                item.outTop1=true;
              }
              if (product.overdue) this.list.data.CountSpxq++; //近效期
            }
          });
        });

        ////计算已选择商品数
        var checkNum = 0;
        this.productList.forEach((ele, i) => {
          if (ele.canBuy && !ele.isSelect) checkNum++;
        });
        this.list.data.ProductCountSelect += checkNum;

        this.productList.forEach((ele, i) => {
          if (ele.canBuy) {
            ele.isSelect = true;
            obj[ele.id] = true;
          }
          ele.sellerJson1.forEach((item, i) => {
            if (item && item.prevSelected) {
              item.selected = true;
            }
          });
        });
      }
      //发送所有商品是否选中数据
      var str = "";
      for (var key in obj) {
        str += key + ":";
        str += obj[key] + ",";
      }
      this.$http
        .post("/WebApi/PurchasePlanSetisSelect", {
          data: str
        })
        .then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          this.myToast("网络错误,请重试!");
        });
    },
    //点击单个checkbox,判断是否要√上全选或者取消√全选,并取消或者选中商品的勾选
    selectOne(e, ind) {
      this.productList[ind].isSelect = e.target.checked;
      if (e.target.checked) {
        //勾选上

        //重新勾选上次选中的商品
        var productIndex = null,
          price = null,
          stock = null,  //库存
          buyCount = this.productList[ind].BuyCount;

        var len = this.productList[ind].sellerJson1.length;
        for (var i = 0; i < len; i++) {
          if (this.productList[ind].sellerJson1[i] &&this.productList[ind].sellerJson1[i].prevSelected){
            this.productList[ind].sellerJson1[i].selected = true;

            // console.log("勾选成功");
            // console.log(this.productList[ind].sellerJson1[i].selected);
            productIndex = i;
            price = this.productList[ind].sellerJson1[i].price;
            stock = this.productList[ind].sellerJson1[i].stock;
          }
        }

        //小计变化
        if (productIndex != null) {
          this.list.data.purchasingCompanyList[productIndex].Total +=
            price * buyCount;
          //近效期数量变化
          if (this.productList[ind].sellerJson1[productIndex].overdue) {
            this.list.data.CountSpxq++;
          }
        }

        //计算超库存
        if (stock!=null && buyCount>stock) {
          this.list.data.CountPurchaseSock++;
          this.productList[ind].outTop0=true;
          this.productList[ind].outTop1=true;
        }
        //计算已选择商品数
        this.list.data.ProductCountSelect++;
      } else {
        //取消勾选
        //计算已选择商品数
        this.list.data.ProductCountSelect--;
        //超库存数
        if (this.productList[ind].outTop1) {
          this.list.data.CountPurchaseSock--;
        }
        var productIndex = null,
          price = null,
          buyCount = this.productList[ind].BuyCount;
        this.productList[ind].sellerJson1.forEach((ele, i) => {
          if (ele && ele.selected) {
            productIndex = i;
            price = ele.price;
            ele.prevSelected = true;
            ele.selected = false;
          } else if (ele) {
            ele.prevSelected = false;
          }
        });
        //小计变化 小计减去当前购买数量*价格
        if (productIndex != null) {
          //console.log(this.list.data.purchasingCompanyList[productIndex].Total);
          this.list.data.purchasingCompanyList[productIndex].Total -=
            price * buyCount;
          //近效期数量变化
          if (this.productList[ind].sellerJson1[productIndex].overdue) {
            this.list.data.CountSpxq--;
          }
        }
      }
      //发送此商品是否选中的数据
      var obj = {};
      obj[this.productList[ind].id] = e.target.checked ? true : false;
      var str = "";
      for (var key in obj) {
        str += key + ":";
        str += obj[key] + ",";
      }
      //console.log(str);
      this.$http
        .post("/WebApi/PurchasePlanSetisSelect", {
          data: str
        })
        .then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          this.myToast("网络错误,请重试!");
        });

      for (
        var i = 0, canBuy = 0, selected = 0;
        i < this.productList.length;
        i++
      ) {
        if (this.productList[i].canBuy) {
          canBuy++;
          if (this.productList[i].isSelect) selected++;
        }
      }
      //console.log(canBuy,selected);
      this.checkall = canBuy == selected ? true : false;
    },
    //导入计划
    upLoad(e) {
      //console.log(e.target.files)
      var reg = /\.xl(s[xmb]|t[xm]|am)$/;
      var fileName = e.target.files[0].name;
      var index = fileName.lastIndexOf("."); //最后一个点出现的位置
      var hz = fileName.slice(index); //后缀名
      //判断是否是excel表格
      if (!reg.test(hz)) {
        this.myToast("请选择正确的excel表格文件!");
      } else {
        this.showLoading = true;
        var data = new FormData();
        data.append("Purchase_id", this.id);
        data.append("file", e.target.files[0]);
        this.showLoading = true;
        this.$http
          .post("/WebApi/PurchasePlanImportExcelMore", data)
          .then(res => {
            if (res.data.success == true) {
              //导入成功
              //log(res.data);
              $('.uploadDoneConfirm').fadeIn();
            } else {
              //导入失败
              if(res.data.info=="请先登录"){
                $('.loginConfirm').fadeIn();
              }else{
                this.myToast(res.data.info);
              }
              this.showLoading = false;
              //this.myToast(res.data.info);
            }
          })
          .catch(err => {
            this.showLoading = false;
            this.myToast("网络错误,请重试!");
          });
      }
    },
    //排序点击默认排序
    defaultSort(e) {
      for (var item of e.currentTarget.parentElement.children) {
        item.className = "";
        var i = item.getElementsByTagName("i")[0];
        if (i) i.className = "";
      }
      this.sorting = 0;
      e.currentTarget.className = "active";
      this.getData();
    },
    //总价差额排序
    zjSort(e) {
      for (var item of e.currentTarget.parentElement.children) {
        item.className = "";
        var i = item.getElementsByTagName("i")[0];
        if (i) i.className = "";
      }
      e.currentTarget.className = "active";
      var num = Number(e.currentTarget.dataset.num);
      var i = e.currentTarget.getElementsByTagName("i")[0];
      var params = 0;
      if (num == 1) {
        i.className = "fa fa-sort-up";
        params = 1;
        this.sorting = 1;
      } else {
        i.className = "fa fa-sort-down";
        params = 2;
        this.sorting = 2;
      }
      e.currentTarget.dataset.num = num * -1;
      this.getData();
    },
    //单价价差额排序
    djSort(e) {
      for (var item of e.currentTarget.parentElement.children) {
        item.className = "";
        var i = item.getElementsByTagName("i")[0];
        if (i) i.className = "";
      }
      e.currentTarget.className = "active";
      var num = Number(e.currentTarget.dataset.num);
      var i = e.currentTarget.getElementsByTagName("i")[0];
      var params = 0;
      if (num == 1) {
        i.className = "fa fa-sort-up";
        params = 3;
        this.sorting = 3;
      } else {
        i.className = "fa fa-sort-down";
        params = 4;
        this.sorting = 4;
      }
      e.currentTarget.dataset.num = num * -1;
      this.getData();
    },
    //按采购数量排序
    countSort(e) {
      for (var item of e.currentTarget.parentElement.children) {
        item.className = "";
        var i = item.getElementsByTagName("i")[0];
        if (i) i.className = "";
      }
      e.currentTarget.className = "active";
      var num = Number(e.currentTarget.dataset.num);
      var i = e.currentTarget.getElementsByTagName("i")[0];
      if (num == 1) {
        i.className = "fa fa-sort-up";
        this.sorting = 5;
        this.productList.sort(function(obj1, obj2) {
          //按照购买数量升序排列
          var val1 = obj1["BuyCount"];
          var val2 = obj2["BuyCount"];
          return val1 - val2;
        });
      } else {
        i.className = "fa fa-sort-down";
        this.sorting = 6;
        this.productList.sort(function(obj1, obj2) {
          //按照购买数量降序排列
          var val1 = obj1["BuyCount"];
          var val2 = obj2["BuyCount"];
          return val2 - val1;
        });
      }
      e.currentTarget.dataset.num = num * -1;
    },
    //药企取消匹配
    cancelMatch(index) {
      this.list.data.purchasingCompanyList[index].Enabled = false;
      //商品列表中index一列商品取消勾选
      this.productList.forEach((ele, i) => {
        if (ele.sellerJson1[index]) {
          if (ele.sellerJson1[index].selected) {
            ele.isSelect = false;
            this.list.data.ProductCountSelect--;
            // this.list.data.purchasingCompanyList[index].Total=0;
          }
          ele.sellerJson1[index].selected = false;
          ele.sellerJson1[index].prevSelected = false;
          ele.sellerJson1[index].canSelect = false;
        }
      });
      this.list.data.purchasingCompanyList[index].Total = 0;
      //向服务器发送数据,取消匹配
      this.showLoading = true;
      var params = new URLSearchParams();
      params.append("id", this.id);
      params.append(
        "storeid",
        this.list.data.purchasingCompanyList[index].storeid
      );
      params.append("Enabled", false);
      this.$http
        .post("/WebApi/PurchasePlanSetMatching", params)
        .then(res => {
          if (res.data.success) {
            this.showLoading = false;
            //this.getData();
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
            this.showLoading = false;
          }
        })
        .catch(err => {
          this.showLoading = false;
          this.myConfirm("网络错误,请重试!");
        });
    },
    //药企启用匹配
    startMatch(index) {
      this.list.data.purchasingCompanyList[index].Enabled = true;
      this.productList.forEach((ele, i) => {
        if (ele.sellerJson1[index]) {
          ele.sellerJson1[index].canSelect = true;
        }
      });
      //向服务器发送数据
      this.showLoading = true;
      var params = new URLSearchParams();
      params.append("id", this.id);
      params.append(
        "storeid",
        this.list.data.purchasingCompanyList[index].storeid
      );
      params.append("Enabled", true);
      this.$http
        .post("/WebApi/PurchasePlanSetMatching", params)
        .then(res => {
          if (!res.data.success) {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
            this.showLoading = false;
          } else {
            this.getData();
          }
        })
        .catch(err => {
          //console.log(err);
          this.showLoading = false;
          this.myToast("网络错误,请重试!");
        });
    },
    //计划内搜索
    planSearch() {
      this.showLoading = true;
      // var DrugName=$('#goods').val().trim(),
      //     Manufacturer=$('#factory').val().trim();
      //console.log(DrugName);
      this.$http
        .post("/WebApi/getlist", {
          id: this.id,
          type: 1,
          DrugName: this.productName,
          Manufacturer: this.factoryName
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
          } else {
            //this.myConfirm(res.data.info);
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
          this.showLoading = false;
        })
        .catch(err => {
          this.showLoading = false;
          this.myConfirm("网络错误,请重试!");
        });
    },
    //刷新按钮
    reset() {
      //var res=confirm('重置所有操作,是否继续?');
      $(".refreshConfirm").fadeIn();
      // if(res){
      //   this.showLoading=true;
      //   this.$http.post('/WebApi/PurchaseEditRefresh',{
      //     id:this.id
      //   }).then(res=>{
      //     if(res.data.success){
      //       this.list=res.data;
      //     }else{
      //       this.myConfirm(res.data.info);
      //     }
      //     this.showLoading=false;
      //   }).catch(err=>{
      //     this.showLoading=false;
      //     this.myConfirm("网络错误,请重试!");
      //   })
      // }
    },
    //取消刷新
    cancelRefresh() {
      $(".refreshConfirm").fadeOut();
    },
    //确定刷新
    goRefresh() {
      $(".refreshConfirm").fadeOut();
      this.showLoading = true;
      this.$http
        .post("/WebApi/PurchaseEditRefresh", {
          id: this.id
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
            //this.myConfirm(res.data.info);
          }
          this.showLoading = false;
        })
        .catch(err => {
          this.showLoading = false;
          this.myConfirm("网络错误,请重试!");
        });
    },
    //全局搜索
    qjSearch() {
      $("#qjSearch iframe").attr(
        "src",
        `/B30Purchase/PurchasePlanProductSearch?purchase_id=${
          this.id
        }&KeywordsN=${this.productName}&KeywordsM=${this.factoryName}`
      );
    },
    closeQjSearch() {
      this.productName = "";
      this.factoryName = "";
      this.showLoading = true;
      this.$http
        .post("/WebApi/getlist", {
          id: this.id,
          type: 1
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
            //console.log(this.list);
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myConfirm(res.data.info);
            }
            //this.myConfirm(res.data.info);
          }
          this.showLoading = false;
        })
        .catch(error => {
          this.showLoading = false;
          this.myConfirm("网络错误,请重试!");
          //console.log(error);
          //console.log("请求数据失败");
        });
    },
    //是否显示可采
    changeShowCanBuy(e) {
      this.getData();
    },
    //是否显示超库存
    changeOverStock(e) {
      this.getData();
    },
    //是否显示近效期
    changePurchaseSpxq(e) {
      this.getData();
    },
    //是否显示价格变化
    changePriceChange(e) {
      this.getData();
    },
    //添加店铺匹配
    addStore() {
      this.$http
        .post("/WebApi/VendorAddSelectAllList")
        .then(res => {
          if (res.data.success) {
            this.CompanyList = res.data.data.VendorList;
            //console.log(this.CompanyList);
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          this.myToast("网络错误,请重试!");
        });
    },
    //模态框中搜索店铺
    searchCompany() {
      var params = new URLSearchParams();
      params.append("VenderName", this.VenderName);
      this.$http
        .post("/WebApi/VendorAddSelectAllList", params)
        .then(res => {
          if (res.data.success) {
            this.CompanyList = res.data.data.VendorList;
          } else {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        })
        .catch(err => {
          this.myToast("网络错误,请重试!");
        });
    },
    //模态框中添加店铺匹配
    addCompany(key) {
      var params = new URLSearchParams();
      params.append("storeid", this.CompanyList[key].venderid);
      this.CompanyList[key].IsVendor = true;
      this.$http
        .post("/WebApi/VendorAdd", params)
        .then(res => {
          if (!res.data.success) {
            //添加失败
            this.CompanyList[key].IsVendor = false;
            // this.myToast(res.data.info);
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          } else {
            //添加成功,重新计算采购计划请求数据
            var params = new URLSearchParams();
            params.append("id", this.id);
            this.$http
              .post("/WebApi/ChangePurchasePlan", params)
              .then(res => {
                if (res.data.success) {
                  this.list = res.data;
                } else {
                  if(res.data.info=="请先登录"){
                    $('.loginConfirm').fadeIn();
                  }else{
                    this.myToast(res.data.info);
                  }
                }
              })
              .catch(err => {
                this.myToast("网络错误,请刷新页面重新生成采购计划!");
              });
          }
        })
        .catch(err => {
          this.CompanyList[key].IsVendor = false;
          this.myToast("网络错误,请重试!");
        });
    },
    //模态框中删除店铺匹配
    removeCompany(key) {
      var params = new URLSearchParams();
      params.append("storeid", this.CompanyList[key].venderid);
      this.CompanyList[key].IsVendor = false;
      //console.log(this.CompanyList[key].venderid);
      this.$http
        .post("/WebApi/VendorDel", params)
        .then(res => {
          if (!res.data.success) {
            this.CompanyList[key].IsVendor = true;
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          } else {
            //删除成功,重新计算采购计划请求数据
            var params = new URLSearchParams();
            params.append("id", this.id);
            this.$http
              .post("/WebApi/ChangePurchasePlan", params)
              .then(res => {
                if (res.data.success) {
                  this.list = res.data;
                } else {
                  this.myToast(res.data.info);
                }
              })
              .catch(err => {
                this.myToast("网络错误,请刷新页面重新生成采购计划!");
              });
          }
        })
        .catch(err => {
          this.CompanyList[key].IsVendor = true;
          this.myToast("网络错误,请重试!");
        });
    },
    //关闭匹配店铺模态框
    closeAddStore() {
      this.getData();
    },
    //点击提交订单按钮
    submitOrder() {
      if (this.list.data.CountPurchaseSock > 0) {
        $(".orderConfirm").fadeIn();
      } else if (
        this.list.data.ProductCountSelect == 0 ||
        this.TotalPrice == 0
      ) {
        $(".pleaseSelect").fadeIn(() => {
          setTimeout(() => {
            $(".pleaseSelect").fadeOut();
          }, 2000);
        });
      } else {
        location.href = "/B30Purchase/PurchaseOrderConfirm?id=" + this.id;
      }
    },
    closeOrder() {
      $(".orderConfirm").fadeOut();
    },
    //提交订单有超库存商品,查看
    checkOverStock() {
      ////清楚筛选条件
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");

      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.showCanBuy = true;
      this.OverStock = true;
      this.PurchaseSpxq = false;
      this.PriceChange = false;
      this.sorting = 0;
      this.getData();
      $(".orderConfirm").fadeOut();
    },
    //通用toast提示
    myToast(val) {
      $(".myToast")
        .text(val)
        .fadeIn(function() {
          setTimeout(() => {
            $(".myToast").fadeOut();
          }, 2000);
        });
    },
    //显示通用确认框
    myConfirm(val) {
      $(".changeConfirm .info").text(val);
      $(".changeConfirm").fadeIn();
    },
    //关闭通用确认框
    closeChange() {
      $(".changeConfirm").fadeOut();
    },
    //未登录,跳转至登录页面
    toLogin(){
      location.href="/home/index";
    },
    //导入成功,刷新页面
    closeUploadConfirm(){
      location.reload();
    },
    //changeIsMatchJxq 改变是否匹配近效期
    changeIsMatchJxq(e){
      //console.log(e.target.checked);
      this.list.data.changeIsMatchJxq=!e.target.checked;
      console.log(this.list.data.changeIsMatchJxq);
    },
    // 改变数据中是否匹配超库存的值
    changeIsMatchNotStock(e){
      //console.log(e.target.checked);
      this.list.data.IsMatchNotStock=!e.target.checked;
       console.log(this.list.data.IsMatchNotStock);
    }

  },
  watch: {
    //仅显示可采checkbox切换
    list(nVal) {
      this.productList = nVal.data.productList;
      //重新计算productList,使其sellerJson1数组长度等于商家个数,便于v-for循环
      var time = new Date();
      time.setFullYear(time.getFullYear() + 1);
      var len = this.list.data.purchasingCompanyList.length;
      this.productList.forEach((ele, index, arr) => {
        ele.BuyCount0 = ele.BuyCount;
        ele.BranchesJson = JSON.parse(ele.BranchesJson);
        var output = [];
        output.length = len;
        for (var i = 0; i < len; i++) {
          var companyId = this.list.data.purchasingCompanyList[i].storeid;
          var canSelect = this.list.data.purchasingCompanyList[i].Enabled;
          for (var j = 0, canBuy = 0, hasSelect = 0;j < ele.sellerJson1.length;j++ ){
            if (ele.sellerJson1[j] != undefined) {
              canBuy++;
              var productId = ele.sellerJson1[j].storeid;
              var product_spxq = new Date(ele.sellerJson1[j].spxq); //计算近效期
              ele.sellerJson1[j].overdue =
                product_spxq - time > 0 ? false : true;
              if (ele.sellerJson1[j].spxq.length > 1) {
                ele.sellerJson1[j].spxq = product_spxq.toLocaleDateString();
              } else {
                ele.sellerJson1[j].overdue = false;
              }
              if (ele.sellerJson1[j].selected) hasSelect++;
            } else {
              var productId = 0.0001;
            }
            if (productId == companyId) {
              ele.sellerJson1[j].canSelect = canSelect;
              output[i] = ele.sellerJson1[j];
              output[i].prevSelected = output[i].selected ? true : false;
              if (!ele.isSelect) output[i].selected = false; //如果商品列的checkbox未选中,那么对应企业的药品也不能选中
              //库存为0标识线下商品
              if (output[i].stock == 0) output[i].offline = true;
              //此商品购买数量>商家的库存数量 标识outTop1
              if ( output[i].selected && ele.BuyCount > output[i].stock && output[i].stock > 0) {
                //库存大于0为线上商品
                ele.outTop0 = true;
                ele.outTop1 = true;
                //console.log(ele.DrugsBase_DrugName)
              } else if (output[i].selected) {
                //未选中与库存为0的商品
                ele.outTop0 = false;
                ele.outTop1 = false;
              }
            }
          }
          ele.canBuy = canBuy > 0 ? true : false;
        }
        if (hasSelect == 0) ele.isSelect = false;
        ele.sellerJson1 = output;
      });
    }
  },
  computed: {
    //已选择商品数
    selectCount() {
      var count = 0;
      for (var item of this.productList) {
        if (item.isSelect) count++;
      }
      return count;
    },
    //计算总价
    TotalPrice() {
      var totalPrice = 0;
      this.list.data.purchasingCompanyList.forEach((ele, i) => {
        totalPrice += ele.Total;
      });
      return totalPrice.toFixed(2);
    }
  }
};
</script>

<style scoped lang="less">
@media (min-width: 992px) {
  .modal-big {
    width: 992-30px;
  }
}
@media (min-width: 1200px) {
  .modal-big {
    width: 1200-30px;
  }
}
@media (min-width: 1400px) {
  .container,
  .modal-big {
    width: 1400-30px;
  }
}
@media (min-width: 1600px) {
  .container,
  .modal-big {
    width: 1600-30px;
  }
}

.header_bg {
  background-color: rgb(60, 141, 188);
  height: 50px;
  >.container{
    >.collapse{
      background-color: rgb(60, 141, 188);
      >.navbar-right{
        .dropdown-menu{
          padding:10px;
          a{
            color:#666;
          }
        }
      }
    }
  }
  a{
    color:#fff;
    &:hover{
      background-color:rgba(0, 0, 0, 0.1);
    }
    &:focus{
      background-color:rgba(0, 0, 0, 0.1);
    }
  }
  .nav .open>a{
    background-color: rgba(0,0,0,0.1);

  }
}
.content {
  background-color: #ecf0f5;
  > .bread {
    margin-top: 20px;
    > .title {
      font-size: 24px;
    }
    > .breadcrumb {
      background-color: #fff;
      a {
        color: #444;
        text-decoration: none;
      }
    }
  }
  > .search {
    background-color: #fff;
    border-top: 3px solid #d2d6de;
    border-radius: 3px;
    padding: 10px 10px;
    margin-bottom: 20px;
    .form-group {
      margin-right: 10px;
    }
  }

  > .box {
    background-color: #fff;
    border-top: 3px solid #d2d6de;
    padding: 10px;
    margin-bottom: 60px;
    > .box_header {
      padding: 10px 0;
      > .check {
        > p {
          display: inline-block;
          margin-right: 5px;
          > span {
            padding: 0 6px;
            background-color: #d2d6de;
            border-radius: 3px;
          }
        }
      }
      > .shortcut {
        > .upload {
          position: relative;
          > input[type="file"] {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            opacity: 0;
          }
        }
      }
    }
    > .detail {
      > .fixed_top {
        padding: 0;
        padding-right: 50px;
        z-index: 666;
        table {
          table-layout: fixed;
          margin-bottom: 0;
          background-color: #fff;
        }

        th {
          text-align: center;
          vertical-align: middle;
        }
        th:first-child {
          width: 40px;
        }
        th:nth-child(2) {
          //width: 260px;
        }
        th:nth-child(3) {
          width: 180px;
          > ul {
            width: 100%;
            margin: 0;
            > li {
              font-size: 12px;
              color: #b0b0b0;
              width: 33.3%;
            }
          }
        }
        th:nth-child(4) {
          width: 100px;
        }
        th.td_supplier {
          padding-bottom: 0;
          padding: 0;
          width:100px;
          //white-space:nowrap;
          // overflow: hidden;
          //text-overflow: ellipsis;
          > a {
            font-size: 12px;
            font-weight: normal;
            &:hover {
              color: #f07540;
              text-decoration: none;
            }
          }
          > .dropdown-menu {
            padding: 10px;
            > a {
              text-decoration: none;
            }
            > .sign {
              background-color: #00c0ef;
              color: #fff;
              padding: 0 4px;
              border-radius: 4px;
            }
            > .sign_offlilne {
              color: #fff;
              background-color: #f39c12;
              padding: 0 4px;
              border-radius: 4px;
            }
            > label {
              font-size: 12px;
              font-weight: 400;
              color: #777;
            }
          }
          > .total_price {
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            font-weight: normal;
            margin-bottom: -10px;
            &.offline {
              background-color: #fcf8e3;
            }
            &.online {
              background-color: #d9edf7;
            }
          }
          > .dropdown-menu-right {
            padding: 10px;
            border: 1px solid #eee;
            h4 {
              font-size: 16px;
            }
            .sign {
              padding: 4px 6px;
              background-color: #00c0ef;
              color: #fff;
              border-radius: 4px;
            }
            > label {
              color: #777;
              font-size: 12px;
              font-weight: normal;
            }
            > p {
              font-size: 16px;
              font-weight: normal;
            }
          }
        }
      }
      > .product_container {
        table-layout: fixed;
        margin-top: 20px;
        tr {
          text-align: center;
          &.no_product {
            cursor: not-allowed;
            input {
              cursor: not-allowed;
            }
          }
          > td {
            vertical-align: middle;
            &:first-child {
              width: 40px;
            }
            &:nth-child(2) {
              position: relative;
              overflow: hidden;
              //width: 260px;
              > b {
                white-space: nowrap;
              }
              > i.marks {
                position: absolute;
                top: 0;
                right: 0;
                border: 6px solid #5bc0de;
                border-left-color: transparent;
                border-bottom-color: transparent;
              }
              > p {
                font-size: 12px;
                color: #999;
                margin: 0;
              }
            }
            &:nth-child(3) {
              width: 60px;
            }
            &:nth-child(4) {
              width: 60px;
            }
            &:nth-child(5) {
              width: 60px;
              &.low {
                color: #00a65a;
              }
              &.high {
                color: #dd4b39;
              }
              > p {
                border-top: 1px solid #dedede;
              }
            }
            &:nth-child(6) {
              width: 100px;
              > input {
                background-color: #fff;
                text-align: center;
                &.out_top {
                  color: red;
                  border-color: red;
                }
              }
            }
            &.td_supplier {
              position: relative;
              padding: 0;
              width:100px;
              &.success {
                cursor: pointer;
              }
              &.not_selected {
                background-color: transparent;
              }
              &.not_allowd {
                cursor: not-allowed;
                text-align: center;
              }
              > div {
                width: 100%;
                height: 100%;
                padding: 10px;
                > p {
                  padding-right: 14px;
                  margin: 0;
                }
                > i.icon {
                  position: absolute;
                  top: 0;
                  right: 0;
                  border: 10px solid #5cb85c;
                  border-left-color: transparent;
                  border-bottom-color: transparent;
                  color: #fff;
                  > span {
                    position: absolute;
                    top: -12px;
                    right: -10px;
                  }
                  > span.fa-close {
                    cursor: pointer;
                  }
                }
                i.red {
                  border: 10px solid #d9534f;
                }
                .price {
                  font-size: 16px;
                }
                .info {
                  > p {
                    color: #999;
                    font-size: 12px;
                    margin: 0;
                    &:first-child {
                      margin: 4px 0;
                    }
                    > .spxq {
                      &.overdue {
                        color: red;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.account {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  > .account_inner {
    @media screen and(min-width:1520px) {
      width: 1500px;
    }
    @media screen and(min-width:1200px) and (max-width: 1519px) {
      width: 1120px;
    }
    @media screen and(max-width:1200px) and(min-width:768px) {
      width: 800px;
    }
    @media screen and(max-width:767px) {
      width: 100%;
    }
    margin: 0 auto;

    height: 50px;
    line-height: 50px;
    background-color: #fff;
    box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.35);
    > p {
      margin: 0;
      color: #777;
      font-size: 12px;
      padding-left: 12px;
      > span {
        color: #f07540;
        font-size: 14px;
        &:last-child {
          font-size: 20px;
        }
      }
    }
    > button {
      background-color: #f07540;
      outline: none;
      border: none;
      color: #fff;
      font-size: 16px;
    }
  }
}
.yjModal {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  > .yjBody {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 600px;
    height: 320px;
    background-color: #fff;
    > .title {
      padding: 15px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      > .rf {
        cursor: pointer;
      }
    }
    > .yjContent {
      border-bottom: 1px solid #ddd;
      > p {
        height: 40px;
        line-height: 40px;
        > .left {
          text-align: right;
          color: #333;
          font-weight: bold;
        }
      }
    }
    > .yjFooter {
      padding: 0 15px;
      text-align: right;
      height: 60px;
      line-height: 60px;
    }
  }
}
.branchesModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.35);
  > .branchesBody {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 600px;
    height: 320px;
    background-color: #fff;
    > .title {
      padding: 15px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      > .rf {
        cursor: pointer;
      }
    }
    > .branchesContent {
      padding: 15px;
      > p {
        height: 40px;
        line-height: 40px;
        > .left {
          text-align: right;
          color: #333;
          font-weight: bold;
        }
      }
    }
    > .branchesFooter {
      padding: 0 15px;
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: right;
      height: 60px;
      line-height: 60px;
    }
  }
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 888;
  background-color: rgba(0, 0, 0, 0.15);
  > img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}
#addStore {
  table {
    td,
    th {
      text-align: center;
      vertical-align: middle;
    }
  }
}
.orderConfirm,
.changeConfirm,
.loginConfirm,
.uploadDoneConfirm,
.refreshConfirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.35);
  > .content {
    position: absolute;
    width: 360px;
    height: 152px;
    padding: 10px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    > .title {
      > span {
        cursor: pointer;
      }
    }
    > .info {
      padding: 16px;
    }
  }
}
.pleaseSelect,
.myToast {
  z-index: 1800;
  position: fixed;
  width: 240px;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  text-align: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.35);
  color: #fff;
}
</style>
