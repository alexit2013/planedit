<template>
<div>
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
            <ul v-html="navbarHtml"  class="nav navbar-nav">
                
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
        <span v-if="list && list.data.Insert_fld_n>0" class="pull-right" style="height:34px;line-height:34px;">
          <i class="fa fa-exclamation-circle" style="color:#CC0000"></i>
          本次计划共有{{list.data.Insert_fld_n}}条商品导入失败,
          <a :href="'/B30Purchase/ExportNoImportPlan?purchase_id='+id" download>点击下载</a>
        </span>
    </div>
    <!-- 采购内容 -->
    <div class="box">
      <!-- 采购内容头部筛选/排序... -->
      <div class="box_header row">
        <!-- 左侧勾选排序 -->
        <div class="check col-xs-12 col-md-6" v-if="list">
          <p>
            <input id="checkscb" type="checkbox" @change="changeShowCanBuy($event)" v-model="showCanBuy"><label for="checkscb">仅显示可采</label><span>{{list.data.CountPurchase}}</span>
          </p>
          <p>
            <input id="checkckc" type="checkbox" @change="changeOverStock($event)" v-model="OverStock" ><label for="checkckc">采购超库存</label><span>{{list.data.CountPurchaseSock}}</span>
          </p>
          <p>
            <input id="checkjxq" type="checkbox" @change="changePurchaseSpxq($event)" v-model="PurchaseSpxq"><label for="checkjxq">近效期(1年以内)</label><span>{{list.data.CountSpxq}}</span>
          </p>
          <p>
            <input id="checkjg" type="checkbox" @change="changePriceChange($event)"  v-model="PriceChange"><label for="checkjg">价格变动</label><span>{{list.data.CountPriceChange}}</span>
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
              <li :class="{'active':sorting==0}" @click="defaultSort($event)">
                <a href="javascript:;">默认排序</a>
              </li>
              <li :class="{'active':sorting==1 || sorting==2}" data-num='1' @click="zjSort($event)">
                <a href="javascript:;">按参考价同供应价 <b>总价</b> 差额排序<i style="margin-left:6px;" :class="{'fa fa-sort-up':sorting==1,'fa fa-sort-down':sorting==2}"></i></a>
              </li>
              <li :class="{'active':sorting==3 || sorting==4}" data-num='1' @click="djSort($event)">
                <a href="javascript:;">按参考价同供应价 <b>单价</b> 差额排序<i style="margin-left:6px;" :class="{'fa fa-sort-up':sorting==3,'fa fa-sort-down':sorting==4}"></i></a>
              </li>
              <li :class="{'active':sorting==5 || sorting==6}" data-num='1' @click="countSort($event)">
                <a href="javascript:;">按采购数量排序<i style="margin-left:6px;" :class="{'fa fa-sort-up':sorting==5,'fa fa-sort-down':sorting==6}"></i></a>
              </li>
            </ul>
          </p>
        </div>
        <!-- 右侧按钮选择排序 -->
        <div class="shortcut text-right col-xs-12 col-md-6 pull-right">
          <button @click="customBtn" class="btn btn-default fa fa-pencil-square-o" data-toggle="tooltip" :title="'自定义表头 当前已选' + customCheckedCount +'项'">       
            <span v-show="customCheckedCount>0" class="badge bg-yellow">{{customCheckedCount}}</span>
            <br/><i>表头</i>
          </button>
          <button @click="reset" class="btn btn-default fa fa-refresh" data-toggle="tooltip" title="取消所有人为操作,重置计划为初始状态">
            <br/><i>重置</i>
          </button>
          <button @click="preferenceBtn"  class="btn btn-default fa fa-cog" data-toggle="tooltip" title="设置采购偏好">
            <br/><i>偏好</i>
          </button>
          <button @click="chooseLow" class="btn btn-default fa fa-check-square-o" data-toggle="tooltip" title="全选最低价供应商">
            <br/><i>最低</i>
          </button>
          <button @click="addStore"  class="btn btn-default fa fa-plus" data-toggle="tooltip" title="设置匹配供应商">
            <span v-if="list && list.data.CompanyCount>0" class="badge">{{list.data.CompanyCount}}</span>
            <br/><i>供应商</i>
          </button>
          <span class="upload btn btn-default fa fa-sign-out" data-toggle="tooltip" title="再次导入采购计划">
            <input @change="upLoad($event)" type="file"/>
            <br/><i>导入</i>
          </span>
        
        </div>

        <div class="pageTurn text-right col-xs-12"  v-if="list">
          <p style="display:inline-block;vertical-align:top;">
            显示方式:
              <select @change="IsPage($event)" class="form-control" style="display:inline;width:90px;">
                <option value="0" :selected="list.data.IsPage==false">不分页</option>
                <option value="1" :selected="list.data.IsPage">分页</option>
              </select>
          </p>
            <p v-if="list.data.IsPage" style="display:inline-block;vertical-align:top;">   
              当前<span v-text="list.data.PageIndex"></span>/<span v-text="list.data.PageCount"></span>页 , 每页显示 
              <select @change="pageSizeChange($event)" v-model="list.data.PageSize" class="form-control" style="width:72px;display:inline;" >
                <option value="20" >20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>条
              <ul style="margin:0;vertical-align:bottom;" class="pagination">
                <li :class="{'disabled':list.data.PageIndex==1}" @click="pageIndexReduce">
                  <a href="javascript:;">
                    <span>&laquo;</span>
                  </a>
                </li>
                <li  v-for="(item,index) in list.data.PageCount" :key="index" @click="pageIndexChange(item)" v-if="item==1 || item==list.data.PageCount || item ==list.data.PageIndex ||(list.data.PageIndex-item<=3 && item<list.data.PageIndex) || (item - list.data.PageIndex<=3 && item>list.data.PageIndex)" :class="{'active':item==list.data.PageIndex}"><a href="javascript:;" v-text="showNum(item)"><a/></li>
                <li :class="{'disabled':list.data.PageIndex==list.data.PageCount}" @click="pageIndexAdd">
                  <a href="javascript:;">
                    <span>&raquo;</span>
                  </a>
                </li>
            </ul>
            </p>
            
          </div>

      </div>
      <!-- 采购详情表格 -->
      <div class="detail">
        <!-- 采购详情头部/滚动时固定在顶部 -->
        <div class="container fixed_top">
        <table class=" table table-bordered" v-if="list">
          <thead>
            <tr>
              <th :class="{'oldChrome':(isChrome && isChrome<56) || isIE}">
                <input type="checkbox" @click="selectAll($event)" class="checkall" :class="{'oldChrome':(isChrome && isChrome<56) || isIE}" vale="all" v-model="checkall" >
              </th>
              <th :class="{'oldChrome':(isChrome && isChrome<56) || isIE,'fixWidth':list.data.purchasingCompanyList.length>6}">商品</th>
              <th v-show="showPrice+showMonthlySales+showStock" :class="{'one':showStock+showMonthlySales+showPrice==1,'two':showStock+showMonthlySales+showPrice==2,'oldChrome':(isChrome && isChrome<56) || isIE}">
                库存信息
                <ul class="clear">
                  <li class="lf" v-if="showStock">库存</li>
                  <li class="lf" v-if="showMonthlySales">月销</li>
                  <li class="lf" v-if="showPrice">参考价</li>
                </ul>
              </th>
              <th :style="{left:298+(showStock+showMonthlySales+showPrice)*50+'px'}" :class="{'fixed':showShadow,'oldChrome':(isChrome && isChrome<56) || isIE}">
                采购数量
              </th>
              <!-- 自定义表头 -->
              <th v-for="(custom,customIndex) in list.data.ExceptionField" :key="customIndex" v-show="custom.show" class="custom">
                {{custom.customName}}
              </th>
              <!-- 自定义表头结束 -->
              <th class="dropdown td_supplier" v-for="(item,index) in list.data.purchasingCompanyList" :key="index">
                <a href= "javascript:;" class="dropdown-toggle" data-toggle="dropdown">{{item.CompanyName.slice(0,6)}}</a>
                <div :class="{'offline':!item.isOnline,'online':item.isOnline}" class="total_price text-center" title="小计">{{'￥'+item.Total.toFixed(2)}}</div>
                <div class="dropdown-menu">
                  <h5>{{item.CompanyName}}</h5>
                  <span class="sign" v-if="item.isOnline">线上</span>
                  <span class="sign_offlilne" v-else>线下</span>
                  <!-- <label>最低价/匹配/总商品</label>
                  <p style="text-align:left">{{item.minPriceCount+'/'+item.MatchingCount+'/'+item.Count}}</p> -->
                  <button v-if="item.storeid!=0" class="btn btn-block btn-default" style="margin-bottom:6px;" :disabled="!item.Enabled" @click="prioritySort(item.storeid)">匹配商品优先排序</button>
                  <a v-if="item.storeid!=0" href="javascript:;">
                    <button @click="cancelMatch(index)" v-if="item.Enabled" class="btn btn-block btn-danger">取消匹配</button>
                    <button @click="startMatch(index)" v-else class="btn btn-block btn-danger">启用匹配</button>
                  </a>
                </div>
                <span v-if="(list.data.PreferredSupplier == item.storeid) && item.storeid!=0" data-toggle="tooltip" data-placement="top" title="主供应商" ></span>
              </th>
            </tr>
          </thead>
        </table>
        </div>
        <!-- 采购详情内容 -->
        <table class="product_container table table-bordered">
          <tbody v-if="productList.length>0">
            <tr v-for="(product,ind) in productList" :key="ind" @click="trChangeIndex(ind)" :class="{'no_product':!product.canBuy,'multiple':product.openMultiple,'oldChrome':(isChrome && isChrome<56) || isIE,'nowTrIndex':nowTrIndex == ind}">
              <td :class="{'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind}">
                <input type="checkbox" @click="selectOne($event,ind)" v-model="product.isSelect" :disabled="!product.canBuy">
                <p v-text="list.data.IsPage?(ind+1)+(list.data.PageIndex-1)*list.data.PageSize:ind+1"></p>
                <i @click="deleteTr(ind,product.id)" title="删除" class="fa fa-window-close fa-lg"></i>
              </td>
              <!-- 商品名称列 -->
              <td @click="startDown(ind)" :class="{'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind,'fixWidth':list.data.purchasingCompanyList.length>6}" class="text-right" data-toggle="popover" data-placement="bottom" :data-content="product.marks">
                <span v-show="nowTrIndex==ind" class="nowTrIndex"></span>
                <b>{{product.DrugsBase_DrugName}}</b>
                <span class="label label-info" v-if="product.BranchesCount>0">多门店</span>
                <span  class='label label-warning' v-if="product.Goods_ID==0">未关联</span>
                <span class="label label-info" v-if="product.fixedSupplier" data-toggle="tooltip" data-placement="left" title="该商品指定有固定供应商">固定</span>
                <span class="label label-success" v-if="product.source==1" data-toggle="tooltip" data-placement="left" title="搜索添加商品">
                  <i class="fa fa-search-plus"></i>
                </span>
                <i class="marks" v-if="product.marks!=''"></i>
                <p><span>{{product.DrugsBase_Specification}}</span> - {{product.DrugsBase_Manufacturer}}</p>
                <p v-show="product.Recent_supplier"> 最近采购：{{product.Recent_supplier}} </p>
                <span class="lastTransaction" v-if="product.LastTransaction" v-text="(new Date(product.LastTransaction)).toLocaleDateString()" data-toggle="tooltip" data-original-title="最近优E+采购时间"></span>
                <span @click="copyPSN(product.PSN)" class="psn" v-if="product.PSN" v-text="product.PSN" data-toggle="tooltip" data-placement="right" title="ERP编号,点击复制"></span>
              </td>
              <!-- 库存 -->
              <td :class="{'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind}"  v-show="showStock">{{product.Stock}}</td>
              <!-- 月销 -->
              <td :class="{'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind}" v-show="showMonthlySales" :style="{left:300+showStock*50+'px'}">{{product.MonthlySales}}</td>
              <!-- 参考价 -->
              <td v-show="showPrice" :style="{left:298+(showStock+showMonthlySales)*50+'px'}" :class="{'high':product.Price-product.HistoryPrice<=0 || product.HistoryPrice ==0,'low':product.Price-product.HistoryPrice>0,'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind}">
                <span>{{product.HistoryPrice}}</span>
                <p class="price_diff" v-if="product.HistoryPrice>0">
                  <i class="fa" :class="{'fa-caret-up':product.Price-product.HistoryPrice<0,'fa-caret-down':product.Price-product.HistoryPrice>0}"></i>
                  <span>{{Math.abs((product.Price-product.HistoryPrice).toFixed(2))}}</span>
                </p>
                <p v-else>0</p>
              </td>
              <!-- 采购数量 -->
              <td  :style="{left:298+(showStock+showMonthlySales+showPrice)*50+'px'}" :class="{'fixed':showShadow,'multiple':product.openMultiple,'nowTrIndex':nowTrIndex == ind}">
                <div class="inputContainer" @mouseenter="mouseOn(ind)" @mouseleave="mouseOff(ind)" style="height:46px;">
                  <input type="text" v-show="!product.openMultiple" :readonly="product.BranchesCount>0" class="form-control" @focus="showBranchesModal($event,ind)" @change="buyCountChange($event,ind)" :class="{'out_top':product.outTop1,'mid':product.BuyCount%product.Goods_Pcs_Small>0}" v-model.number.lazy="product.BuyCount" :disabled="!product.canBuy">
                  <p v-if="product.openMultiple" style="background-color:#fff;padding:6px 0;">
                    <span v-html="multipleCount(ind)"></span>
                      /
                    <span>{{product.BuyCount}}</span>
                  </p>
                  <button @click="startMultiple(ind)" v-show="product.canMultiple && !product.openMultiple && product.mouseOn && product.outTop1 &&product.isSelect" class="open btn btn-primary btn-xs">供应商多选</button>
                  <button @click="showBranchesModal2(ind)" v-show="product.mouseOn && !product.outTop1 && list.data.BranchesList.length>0" class="open btn btn-primary btn-xs">指定门店</button>
                </div>
                <button @mouseenter="showClose($event)" @mouseleave="showOpen($event)" @click="closeMultiple(ind,$event)" v-show="product.canMultiple && product.openMultiple" class="opened btn btn-primary btn-xs">多选</button>
                <i v-show="product.wrongPrice" data-toggle="popover" data-placement="top" data-content="该商品参考价同供应价差异较大，可能为以下情况：<br/>1 该商品为拆零商品，请仔细检查并修改采购数量！<br/>2 商品关联错误，请在商品目录管理中重新关联或本次取消该商品采购。" style="color:red;position:absolute;right:8px;top:28px;" class="fa fa-exclamation-circle"></i>
                <p v-show="product.Goods_Pcs_Small>1 && product.BranchesJson==null && (!product.openMultiple) " @click="midChange(ind,$event)" style="color:#999;position:absolute;left:18%;top:0;margin:0;font-size:12px;cursor:pointer;">
                  中包装  
                  <span>{{product.Goods_Pcs_Small}}</span>
                  <i data-toggle="popover" data-placement="bottom" data-content="所选供应商只能按中包装整倍数采购，点击中包装数量可自动修改" class="fa fa-question-circle"></i>
                </p>
              </td>
              <!-- 自定义列开始 -->
              <td v-for="(custom,customIndex) in list.data.ExceptionField" :key="customIndex" v-show="custom.show" class="custom">
                <div style="height:60px;overflow:hidden;word-break:break-all;">
                  {{product.ExceptionFieldJsonModel?product.ExceptionFieldJsonModel[custom.customName]:"-"}}
                </div>
                
              </td>
              <!-- 自定义列结束 -->
              <!-- 药企对应商品 -->
              <td v-for="(item,key) in product.sellerJson1"  :key="key" class="td_supplier text-right" :class="{success:item,not_selected:!item||(!item.selected&&item.buyCount==0)||!product.isSelect||(product.openMultiple && item.buyCount==0),not_allowd:!item||!item.canSelect}">
                <!-- 有商品 -->
                <div v-if="item" @click="product_choose(ind,key,product.BuyCount,item.price)" @mouseenter="showPopOver(product,item,$event)" @mouseleave="closePopOver($event)" >
                  <b v-if="item.Remarks"></b>
                  <i class="icon" v-show="(!product.openMultiple&&item.selected&&product.isSelect) || (item.buyCount>0 && product.openMultiple&&product.isSelect)" @click.stop="cancel_select(ind,key,product.BuyCount,item.price)">
                    <span class="fa fa-check"></span>
                  </i>
                  <p v-if="item.bargain>0">
                    <span class="label label-warning">议</span>
                    {{item.bargain}}
                  </p>
                  <span v-if="item.storeid == product.LastException && item.storeid!=0" style="color:#F39C12;" class="fa fa-exclamation-circle" data-toggle="tooltip" data-placement="top" title="上次选择供应商,存在开票/出库差异"></span>
                  <span v-if="item.fixedSupplierTooltip" class='label-info fixCircle'></span>
                  <span class="price"  :class="{'max':item.price==product.maxPrice,'min':item.price==product.minPrice}">{{item.price.toFixed(2)}}</span>
                  <div v-show="!product.openMultiple || (product.openMultiple && item.buyCount==0) || (product.openMultiple && !product.isSelect)" class="info">
                    <p v-if="item.storeid != 0">库存 {{item.stock}} <span v-if="item.Goods_Pcs_Small>1 && item.ismidpacking">{{"["+item.Goods_Pcs_Small+"]"}}</span></p>
                    <p v-else>{{item.CompanyName}}</p>
                    <p v-if="item.storeid != 0">效期 <span class="spxq" :class="{'overdue':item.overdue}">{{item.spxq.slice(2)||'-'}}</span></p>
                    <p v-else>{{"共"+item.OfflineSupplierCount+"个报价"}}</p>
                  </div>
                  <div v-show="product.openMultiple && item.buyCount>0 &&product.isSelect">
                    <input style="margin-left:4px;" @click.stop="multipleClick" @change="multipleBuyCountChange(ind,key,item.stock,$event)" type="text" class="form-control" :value="item.buyCount"   :class="{'out_top':item.buyCount>item.stock}">
                  </div>
                </div>
                <!-- 无商品 -->
                <div v-else>
                  -
                </div>
                <!-- popover -->
                <p style="display:none;">较主供应商价格 + 10%</p>
                <!-- 主供应商 较最低价  百分比   -->
                <span v-if="!product.openMultiple && item && item.price > product.minPrice && item.storeid == list.data.PreferredSupplier && item.storeid!=0">{{'+'+((item.price-product.minPrice)/product.minPrice*100).toFixed(2)+'%'}}</span>
              </td>
            
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pageTurn text-right col-xs-12" v-if="list">
        <p style="display:inline-block;vertical-align:top;">
          显示方式:
          <select @change="IsPage($event)" class="form-control" style="display:inline;width:90px;">
            <option value="0" :selected="list.data.IsPage==false">不分页</option>
            <option value="1" :selected="list.data.IsPage">分页</option>
          </select>
        </p>
        <p v-if="list.data.IsPage" style="display:inline-block;vertical-align:top;">   
          当前<span v-text="list.data.PageIndex"></span>/<span v-text="list.data.PageCount"></span>页 , 每页显示 
          <select @change="pageSizeChange($event)" v-model="list.data.PageSize" class="form-control" style="width:72px;display:inline;" >
            <option value="20" >20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>条
          <ul style="margin:0;vertical-align:bottom;" class="pagination">
            <li :class="{'disabled':list.data.PageIndex==1}" @click="pageIndexReduce">
              <a href="javascript:;">
                <span>&laquo;</span>
              </a>
            </li>
            <li  v-for="(item,index) in list.data.PageCount" :key="index" @click="pageIndexChange(item)" v-if="item==1 || item==list.data.PageCount || item ==list.data.PageIndex ||(list.data.PageIndex-item<=3 && item<list.data.PageIndex) || (item - list.data.PageIndex<=3 && item>list.data.PageIndex)" :class="{'active':item==list.data.PageIndex}"><a href="javascript:;" v-text="showNum(item)"><a/></li>
            <li :class="{'disabled':list.data.PageIndex==list.data.PageCount}" @click="pageIndexAdd">
              <a href="javascript:;">
                <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </p>
        
      </div>
    </div>

  </div>


    <!-- 底部统计结算固定条 -->
    <div class="account">
      <div class="account_inner  clear" v-if="list">
        <p class="lf">共&nbsp;<span class="num">{{list.data.ProductCount}}</span>&nbsp;件商品,已选择&nbsp;<span class="num">{{list.data.ProductCountSelect}}</span>&nbsp;件,其中&nbsp;<span>{{list.data.noLinkCount}}</span>&nbsp;件未关联,<a :href="'/B30Purchase/CatalogueList?purchase_id='+id">点击关联</a>&nbsp;&nbsp;&nbsp;合计:<span class="num">￥{{TotalPrice}}</span>(较上次节省:&nbsp;&nbsp;￥{{saveMoney}})</p>
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
              <div class="form-group row">
                  <div class="col-sm-3 text-right">固定供应商</div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_fixedSupplier" value="0">全部</label>
                    <label><input type="radio" name="filter_fixedSupplier" value="1"> 有固定供应商</label>
                    <label><input type="radio" name="filter_fixedSupplier" value="2"> 无固定供应商</label>
                  </div>
              </div>
              <div class="form-group row">
                  <div class="col-sm-3 text-right">最近采购<span data-toggle="tooltip" title="" data-original-title="筛选最近优E+采购过的商品" class="fa fa-question-circle"></span></div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_LastTransaction" value="0">全部</label>
                    <label><input type="radio" name="filter_LastTransaction" value="-1"> 近一天</label>
                    <label><input type="radio" name="filter_LastTransaction" value="-3"> 近三天</label>
                  </div>
              </div>
              <div class="form-group row">
                  <div class="col-sm-3 text-right">中包装限制<span data-toggle="tooltip" title="" data-original-title="不符所选供应商中包装限制的商品" class="fa fa-question-circle"></span></div>
                  <div class="col-sm-9">
                    <label><input type="radio" class="default" checked name="filter_ismidpacking" value="0">全部</label>
                    <label><input type="radio" name="filter_ismidpacking" value="1"> 不符中包装限制 </label>

                  </div>
              </div>
              <!-- 自定义字段筛选 -->
              <div class="customFilter" v-if="list">
                  <h1 style="border-bottom:1px solid #ddd;font-size:16px;padding-bottom:10px;">自定义字段</h1>
                  <div class="form-group row" v-for="(item,ind) in list.data.ExceptionField" :key="ind">
                    <div class="col-sm-2 text-right">{{item.customName}}</div>
                    <div class="col-sm-2">
                      <label>
                        <input class="default" type="radio" :name="item.customName" checked value="0">全部
                      </label>
                    </div>
                    <div class="col-sm-2">
                      <label>
                        <input type="radio" :name="item.customName" value="1">不为空
                      </label>
                    </div>
                    <div class="col-sm-6 searchWordsContainer">
                      <label>
                        <input type="radio" :name="item.customName" value="2">精准搜索
                      </label>
                      <input class="searchWords" style="width:160px;" type="text" disabled>
                    </div>
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
          <div v-if="list && showCGPH" class="modal-body">
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
                      <label class="input"><input :checked="!list.data.IsMatchJxq" @click="changeIsMatchJxq($event)" type="checkbox" name="IsJxq"> 近效期不选</label> <span data-toggle="tooltip" title="" class="fa fa-question-circle" data-original-title="效期12个月：近效期5个月，效期12个月以上：近效期12个月"></span>
                      <br>
                      <label class="input"><input :checked="!list.data.IsMatchNotStock" @click="changeIsMatchNotStock($event)" type="checkbox" name="IsNoStock"> 库存不足不选</label> <span data-toggle="tooltip" title="" class="fa fa-question-circle" data-original-title="不选库存不满采购量的供应商"></span>
                  </div>
              </div>
              <a @click="toggleOpen($event)"  href="#setting" class="toggleBtn btn btn-default" data-toggle="collapse">
                  高级选项(选填)
                  <span class="caret"></span>
              </a>
              <div id='setting' class="collapse" style="padding-top:10px;" >
                    <div class="form-group row">
                        <label class="col-sm-4" for="">主供应商</label>
                        <div class="col-sm-7" style="display:inline-block;">
                          <select @change="PreferredSupplierChange($event)" class="form-control" name="PreferredSupplier" id="">
                            <option value="0" :selected="list.data.PreferredSupplier == 0">未选择</option>
                            <option v-for="(item,index) in filterCompanyName" :key="index"  :value="item.storeid" :selected="list.data.PreferredSupplier == item.storeid" >{{item.CompanyName}}</option>
                          </select>
                        </div>
                        <span class="fa fa-question-circle" data-toggle="tooltip" data-original-title="所有商品优先从主供应商选择"></span>
                    </div>

                    <div class="form-group">
                        <label style="margin-right:15px;" class="col-sm-4" for="">例外条件</label>
                        <label style="font-weight:normal;"><input name="exception" value='0' type="radio" :checked="list.data.LimitPercentage<=0" :disabled="list.data.PreferredSupplier==0">
                        无
                        </label>
                    </div>


                    <div class="form-group row">
                        <label style="margin-right:15px;" class="col-sm-4"  for="">&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <label style="font-weight:normal;" ><input name="exception" value='1' type="radio" :checked="list.data.LimitPercentage>0" :disabled="list.data.PreferredSupplier==0" >
                        主供应商价格高于最低价<input :value="list.data.LimitPercentage" :disabled='list.data.LimitPercentage<=0' class="percent" style="width:44px;" type="text"> % 则选择最低价
                        </label>
                    </div>
 
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCGPH=false" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button"  @click="showCGPH=false" class="post btn btn-primary">保存</button>
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
        <div class="branchesContent" style="overflow-y:auto;">
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
          <button class="btn btn-default shut">取消</button>
          <button class="post btn btn-primary">确定</button>
        </div>
      </div>
    </div>
    <!-- 5、加载中loading图 -->
    <div v-show="showLoading" class="loading">
      <img src="../assets/img/loading-0.gif"/>
    </div>
    <!-- 6、添加匹配店铺模态框 -->
    <div class="modal fade" id="addStore" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" @click="closeAddStore" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">添加匹配店铺</h4>
          </div>
          <div class="modal-body" v-if="CompanyList">
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
              <tbody >
                <tr v-for="(item,key) in CompanyList.VendorList" :key="key">
                  <td>{{item.venderename}}</td>
                  <td>{{item.pcount}}</td>
                  <td>
                    <button @click="addCompany(key)" v-if="!item.IsVendor" class="btn btn-primary">加入匹配</button>
                    <button @click="removeCompany(key)" v-else class="btn btn-danger">取消匹配</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav aria-label="Page navigation" class="text-right" >
              <ul class="pagination">
                <li v-for="(val,index) in CompanyList.pageCountList" :key="index" :class="{active:CompanyList.page==val}"><a @click="changePage(val)" href="javascript:;">{{val}}</a></li>
              </ul>
            </nav>
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
        <p class="info" v-if="list">有&nbsp;{{this.list.data.CountPurchaseSock}}&nbsp;个品种超出了库存数量，不能提交订单。</P>
        <p class="text-right">
          <button @click="closeOrder" class="btn btn-default">确定</button>
          <button @click="checkOverStock" class="btn btn-primary">查看</button>
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
          <button @click="cancelRefresh" class="btn btn-default">取消</button>
          <button @click="goRefresh"  class="btn btn-primary">确定</button>
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
    <!-- 15、删除确认框 -->
    <div class="deleteConfirm" style="display:none;">
      <div class="content">
        <h4 class="title">信息
          <span @click="closeDeleteConfirm" class="shut rf">&times;</span>
        </h4>
        <p class="info">当前商品会被删除,此操作不可撤销,是否确定?</P>
        <p class="text-right">
          <button @click="closeDeleteConfirm" class="btn btn-default">取消</button>
          <button @click="deleteNow" class="btn btn-primary post">确定</button>
        </p>
      </div>
    </div>
    <!-- 16、线下供应商选择模态框-->
    <div class="offlineModal" style="display:none;">
      <div class="offlineBody">
        <h4 class="title">
          供应商选择
          <span class="rf" @click="closeOffline" >&times;</span>
        </h4>
        <div class="offlineContent">
          <ul>
            <li v-for="(item,index) in offlineModalData" :key="index">
              <p class="companyName">{{item.CompanyName}}</p>
              <p class="total" :class="{'online':getIsOffline(item.storeid)}" v-text="getOfflineTotal(item.storeid)"></p>
              <div @click="offlineSelect(item.storeid)" class="info" :class="{'selected':item.selected}" data-container="body" data-toggle="popover" data-placement="bottom" :data-content="item.Remarks">
                  <p class="price">{{item.price}}</p>
                  <p class="stock">
                    {{'库存 '+item.stock}}
                    <span v-if="item.Goods_Pcs_Small>1" v-text="'['+item.Goods_Pcs_Small+']'"></span>
                  </p>
                  <p class="spxq" v-text="getOfflineDate(item.spxq)"></p>
                  <i v-if="item.selected" class="icon">
                    <span class="fa fa-check"></span>
                  </i>
              </div>
            </li>
          </ul>
        </div>
        <div class="offlineFooter">
          <button @click="offlinePost" class="post btn btn-primary">确定</button>
        </div>
      </div>
    </div>
    <!-- 17、自定义表头设置模态框 -->
    <div  v-if="list && showCustomModal"  class="customModal" >
      <div class="customBody">
        <h4 class="title">自定义表头设置
          <span @click="closeCustom" class="rf shut">&times;</span>
        </h4>
        <div class="customContent">
          <div class="top">
            <label>
              <input @click="checkCustomAll($event)" type="checkbox">全部字段 <span class="count">( {{list.data.ExceptionField?list.data.ExceptionField.length+3:3}} )</span>
            </label>
            <!-- <p class="pull-right">
              已选字段 <span class="selectCount"> {{customCheckedCount}} </span>
            </p> -->
          </div>
          <div class="inner">
            <div v-if="list.data.ExceptionField && list.data.ExceptionField.length>0" class="customTable">
              <p class="titleLine">自定义字段</p>
              <div class="customTableContent">
                <label v-for="(item,key) in list.data.ExceptionField" :key="key"><input :value="item.customName" :checked="item.show" type="checkbox">{{item.customName}}</label>
              </div>
            </div>
            <div class="referTab">
              <p class="titleLine">参考字段</p>
              <div class="referTableContent">
                <label><input type="checkbox"  :checked="showStock">库存信息: 库存</label>
                <label><input type="checkbox"  :checked="showMonthlySales">库存信息: 月销量</label>
                <label><input type="checkbox"  :checked="showPrice">库存信息: 参考价</label>
              </div>

            </div>

          </div>
        </div>
        <div class="customFooter">
          <button @click="closeCustom" class="shut btn btn-default">取消</button>
          <button @click="confirmCustom" class="post btn btn-primary">保存设置</button>
        </div>
      </div>
    </div>

  
</div>
</template>

<script>
import Vue from "vue";
import moment from 'moment';
export default {
  name: "App",
  components: {},
  data() {
    return {
      url:'/WebApi/',
      id: 0,
      sorting: 0, //排序按钮点击对应的值
      factoryName: "",
      productName: "",
      showStock:0,       //是否显示库存列(所有库存列都为0则不显示)
      showMonthlySales:0,//是否显示月销列(同上)
      showPrice:0,       //是否显示参考价(同上)
      showShadow:false,  //是否显示阴影
      showLoading: false,
      showYj: false,
      checkall: true,
      showCanBuy: true, //是否显示可采
      OverStock: false, //是否勾选采购超库存
      PurchaseSpxq: false, //是否勾选上近效期
      PriceChange: false, //是否显示价格变动
      filter_select: 0, //筛选全部/已选择/未选择
      filter_pricetype: 0, //筛选价格 0全部 1 参考价高于供价 2 参考价低于供价
      filter_source: 0, //过滤品种来源 1 导入，2搜索添加
      filter_fixedSupplier:0,  //固定供应商  0 全部  1固定   2不固定
      filter_LastTransaction:0,  //搜索最近采购  0全部   -1最近一天   -3最近3天
      filter_ismidpacking:0,     //筛选中包装    0全部    1不符合中包装
      VenderName: "", //添加店铺模态框中的搜索店铺输入框绑定
      productList: [],
      CompanyList: [],
      list: null,
      userList:null,
      isLogin:false,
      modalCompanyChange:false,   //打开模态框中添加或删除店铺是否点击
      navbarHtml:''  ,              //动态获取navbar代码片段
      isChrome:false,
      isIE:false,
      showCGPH:false,              //点开采购偏好模态框
      startScroll:0,              //点击商品名称,开始使用方向键滚动页面的起始位置
      nextScrollHeight:0,          //由于tr高度不等,方向键滚动时需要计算下一个tr高度
      prevScrollHeight:0,          //上一个tr高度
      halfScreenHeight:0,          //屏幕高度的一半
      nowTrIndex:null,                 //当前方向箭头滚动到的下标
      offsetLeft:0,                  //固定顶部距离页面左侧的距离
      offlineModalData:[],             //点击线下汇总弹出显示数据
      pageIndex:1,
      pageSize:100,
      customCheckedCount:0,      //自定义表头已选数量
      showCustomModal:false      //是否显示自定义模态框

    };
  },
  created() {
    //判断chrome浏览器的版本,小于等于55不支持sticky
    this.isChrome = this.getChromeVersion();
    this.isIE = this.IEBrowser();
    //console.log(this.list);
    //获取用户登录信息
    this.$http.post(this.url+'GetUserInfo').then(res=>{
      if(res.data.success){
        this.userList=res.data.data;
        this.isLogin=true;
      }else{
        location.href="/home/index";
      }
    }).catch(err=>{
      this.myConfirm('网络错误,无法获得登录信息!');
      location.href="/home/index";
    })

    //获取动态navbar
    this.$http({
      method:'get',
      url:'/B30Purchase/GetMenuList',
      responseType:'text'
    }).then(res=>{
      this.navbarHtml = res.data;
    })
    
    this.id = location.search.slice(4);
    if(localStorage[this.id+'sorting']) this.sorting = Number(localStorage[this.id+'sorting']);
    if(localStorage[this.id+'showCanBuy'])  this.showCanBuy=Boolean(Number(localStorage[this.id+'showCanBuy']));
    if(localStorage[this.id+'nowTrIndex'])  this.nowTrIndex=Number(localStorage[this.id+'nowTrIndex']);
    if(localStorage[this.id+'PageIndex']) this.pageIndex = Number(localStorage[this.id+'PageIndex']);
    if(localStorage[this.id+'PageSize']) this.pageSize = Number(localStorage[this.id+'PageSize']);
    this.getData();
  },
  mounted() {

    //屏幕高度的1/4
    this.halfScreenHeight = $(window).height()/4;
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
      html:true,
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
        // console.log("店铺价格是"+price);
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
        bargain = parseFloat($this.data("bargain")),
        BuyCount = Number($this.data('buyCount'));
      //console.log(bargain);
      this.productList[productIndex].sellerJson1[storeIndex].bargain = bargain;
      if (!isNaN(bargain)) {
        if($this.data('openMultiple')!= true){
          var params = new URLSearchParams();
          params.append("purchaselistid", purchaselistid);
          params.append("storeid", storeid);
          params.append("bargain", bargain);
          this.$http.post(this.url+"PurchasePlanBargain", params).then(res => {
            if(!res.data.success){
              if(res.data.info=="请先登录"){
                $('.loginConfirm').fadeIn();
              }else{
                this.myConfirm(res.data.info);
              }
            }
          });
        }else{
          //向服务器发送数据
          this.multiplePost(purchaselistid,storeid,BuyCount,bargain);
        }
        
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
    $branchesModal.on("click", ".shut", (e)=> {
      $branchesModal.slideUp();
    });
    //增加采购门店
    $branchesModal.on('click','.fa-plus',(e)=>{
      //如果editBox中最后一条为select下拉选择框,去除
      var $select = $branchesModal.find('.editBox select');
      if($select.length>0){
        var text = $select.find('option:selected').text();
        $select.parent().html(text);
      }

      var index = $(e.target).parents('.branchesBody').find('.post').data('productIndex');
      var html = "<p class='row'><span class='left col-xs-4'><select>";
      //总可用门店
      var newBranchesList= [];

      for(var item of this.list.data.BranchesList){
        newBranchesList.push(item);
      }

      var $NameBranches = $(e.target).parents('.branchesBody').find('.editBox .left');
      //处理为当前下拉选择框可用option

      $NameBranches.each((key,dom)=>{
        var find = newBranchesList.indexOf($(dom).text());
        if(find != -1){
          newBranchesList.splice(find,1);
        }
      })

      if(newBranchesList.length==0){
        this.myToast("门店已全部添加");
        return;
      }

      for(var i = 0; i < newBranchesList.length; i++){
        html+=`<option>${newBranchesList[i]}</option>`;
      }
      html+=`</select></span><span class='right col-xs-4'><input style="width:100px;"   value="1" class="input form-control" type="number"> 
              </span><i class="fa fa-minus-circle" aria-hidden="true" title="删除"></i></p>`;

      $branchesModal.find('.editBox').append(html);
      var total = parseInt($branchesModal.find(".total").text());
      $branchesModal.find(".total").text(++total);

     /*  var params = new URLSearchParams();
        params.append('Purchase_Id',this.id);
        params.append('psn',$branchesModal.find('.post').data('psn'));
        $branchesModal.find('.editBox>.row').each(function(key,dom){
          var $row =$(dom);
          var BranchesName = $row.find('.left').text() || $row.find('.left option:selected').text();
          var BranchesBuyCount = $row.find('.right>input').val();
          params.append(key,BranchesName);
          params.append(key+'_1',BranchesBuyCount);
        })
        this.$http.post(this.url+'PurchasePlanModifyBranchesBuyCount',params)
              .then(res=>{
                if(res.data.success){
                  this.productList[index].BranchesJson.length = 0;
                  for(var item of JSON.parse(res.data.data)){
                    this.productList[index].BranchesJson.push(item);
                  }
                }else{
                  this.myConfirm(res.data.info)
                }
              }) */

    })
    //删除门店
    $branchesModal.on('click','.fa-minus-circle',(e)=>{
      // console.log($branchesModal.find('.post').data('psn'));
      var $this = $(e.target);
      //如果只剩一个不能删除
      if($this.parents('.editBox').children('.row').length <=1 ){
        this.myToast('只剩一个门店,无法删除');
        return;
      }
      var reduce  = parseInt($this.prev().children('input').val());
      $this.parent().remove();
      var total = parseInt($branchesModal.find(".total").text());
      $branchesModal.find(".total").text(total-reduce);
      
    /*    var params = new URLSearchParams();
          params.append('Purchase_Id',this.id);
          params.append('psn',$branchesModal.find('.post').data('psn'));
          params.append('shortName',$this.parent().find('.left').text() || $this.parent().find('.left option:selected').text());
          
          this.$http.post(this.url+'PurchasePurchaseBranchesDelete',params).then(res=>{
            if(res.data.success){
              var productIndex =  Number($branchesModal.find('.post').data('productIndex'));
              this.productList[productIndex].BranchesJson.length = 0;
              for(var item of JSON.parse(res.data.data)){
                this.productList[productIndex].BranchesJson.push(item);
              }
      
            }else{
              this.myConfirm(res.data.info);
            }
          }) */


    })
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
      //this.productList[productIndex].BranchesJson[branchesIndex].BuyCount = value;

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
            //计算节省金额
            if(this.productList[productIndex].HistoryPrice>0){
              //当修改后的购买数量大于之前的购买数量
                var save= (total-buyCount0)*(this.productList[productIndex].HistoryPrice - ele.price);
                this.list.data.SelectSavePriceAll +=save;
                this.list.data.SelectPriceAll += (total-buyCount0)*ele.price;
            }

          }
        });
      } else if (total < buyCount0) {
        //修改后数量减少
        var ce = parseInt(buyCount0 - total);
        this.productList[productIndex].sellerJson1.forEach((ele, i) => {
          if (ele && ele.prevSelected) {
            this.list.data.purchasingCompanyList[i].Total -= ce * ele.price;
            //计算节省
            if(this.productList[productIndex].HistoryPrice>0){
              var save= (buyCount0 - total) * (this.productList[productIndex].HistoryPrice - ele.price);
              this.list.data.SelectSavePriceAll -= save;
              this.list.data.SelectPriceAll -= (buyCount0 - total)*ele.price;
          
            }

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
     /*  $(".branchesModal .input").each((i, ele)=> {
        var $input = $(ele);
        var id = $input.data("id"),
          value = parseInt($input.val());
        // obj[id]=value;
        params.append(id, value);

        var branchesIndex = $input.data('branchesindex');
        if(branchesIndex){
          this.productList[productIndex].BranchesJson[branchesIndex].BuyCount = value;
        }
        

      }); */
      params.append('Purchase_Id',this.id);
      params.append('psn',$branchesModal.find('.post').data('psn'));
      $branchesModal.find('.editBox>.row').each(function(key,dom){
        var $row =$(dom);

        var cloneRow = $row.find('.left').clone();
        cloneRow.find(":nth-child(n)").remove();
        var BranchesName = cloneRow.text() || $row.find('.left option:selected').text();
        var BranchesBuyCount = $row.find('.right>input').val();
        params.append(key,BranchesName);
        params.append(key+'_1',BranchesBuyCount);
      })
      

      this.$http
        .post(this.url+"PurchasePlanModifyBranchesBuyCount", params)
        .then(res => {
          // console.log(res.data);
          if (!res.data.success) {
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myConfirm(res.data.info);
            }
          }else{
            var productIndex =  Number($branchesModal.find('.post').data('productIndex'));
            this.productList[productIndex].BranchesJson = null;
            this.productList[productIndex].BranchesJson=[];
            for(var item of JSON.parse(res.data.data)){
              this.productList[productIndex].BranchesJson.push(item);
            }
          }
        })
        .catch(err => {
          // console.log(err);
          this.myConfirm("网络错误,请重试!");
        });
      //向服务器发送修改后的总数
      /* this.$http
          .post(this.url+"PurchasePlanModifyBuyCount", {
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
      }); */

      $branchesModal.slideUp();
    });

    //采购偏好设置提交按钮
    $("#cg_preference .post").click(e => {
      this.pageIndex = 1;
      //清除之前的筛选条件
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");

      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.filter_fixedSupplier = 0,  
      this.filter_LastTransaction = 0,
      this.filter_ismidpacking = 0;
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
      this.list.data.IsMatchNotStock = Boolean(IsNoStock);
      var IsJxq = Number(
        !$("#cg_preference input[name='IsJxq']").is(":checked")
      );
       this.list.data.IsMatchJxq = Boolean(IsJxq);
      var habit = Number($("#cg_preference input[name='habit']:checked").val()) || 0;
      this.list.data.PriceEqual = habit;

      
      var PreferredSupplier = Number( $("#cg_preference select[name='PreferredSupplier'] option:selected").val() );
      var LimitPercentage = Number( $("#cg_preference .percent").val() ) || 0;
      this.list.data.PreferredSupplier = PreferredSupplier;
      this.list.data.LimitPercentage = LimitPercentage;
      var params = new URLSearchParams();
      params.append("PurchaseId", this.id);
      params.append("IsNoStock", IsNoStock);
      params.append("IsJxq", IsJxq);
      params.append("habit", habit);
      params.append('PreferredSupplier',PreferredSupplier);
      params.append('LimitPercentage',this.list.data.LimitPercentage);
      this.showLoading = true;
      this.$http
        .post(this.url+"PurchasePerferenceSett", params)
        .then(res => {
          if (res.data.success) {
            //this.list=res.data;
            this.$http
              .post(this.url+"PurchaseEditRefresh", {
                id: this.id
              })
              .then(res => {
                if (res.data.success) {
                  this.list = res.data;
                  //console.log(this.list);
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
                this.showLoading = false;
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
      this.pageIndex = 1;
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

      var filter_fixedSupplier = Number(
        $("#cg_filter input[name='filter_fixedSupplier']:checked").val()
      )
      this.filter_fixedSupplier = filter_fixedSupplier;
      if(filter_fixedSupplier > 0) count++;

      var  filter_LastTransaction =Number(
        $("#cg_filter input[name='filter_LastTransaction']:checked").val()
      )
      this.filter_LastTransaction = filter_LastTransaction;
      if(filter_LastTransaction != 0) count++;

      var filter_ismidpacking = Number(
        $("#cg_filter input[name='filter_ismidpacking']:checked").val()
      )
      this.filter_ismidpacking = filter_ismidpacking;
      if(filter_ismidpacking != 0) count++;

      // 自定义字段
      var Customobj = {};
      $('#cg_filter .customFilter input:radio:checked').each(function (i,ele) {
        var $customRadio = $(ele);
        var val = $customRadio.val();
        var key = $customRadio.attr('name');
        var searchWords = $customRadio.parents('.form-group').find('.searchWords').val();
        if( val =='0' ){

        }else if(val == '1'){
          Customobj[key] = '';
          count++;
        }else if(val == '2'){
          Customobj[key] = searchWords;
          count++;
        }
      })

      

      var $label = $(".box_header .filter_num");
      if (count > 0) {
        $label.text(count);
        
      } else {
        $label.text("");
      }
      //请求数据
        this.showLoading = true;
        this.$http
          .post(this.url+"getlist", {
            id: this.id,
            type: Number(this.showCanBuy),
            OverStock: Number(this.OverStock),
            PurchaseSpxq: Number(this.PurchaseSpxq),
            PriceChange: Number(this.PriceChange),
            filter_select,
            filter_pricetype,
            filter_source,
            filter_fixedSupplier,
            filter_LastTransaction,
            ismidpacking:filter_ismidpacking,
            filter_ExceptionField:JSON.stringify(Customobj)

          }).then(res => {
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

      $("#cg_filter").modal("hide");
    });
    //2.清除筛选按钮
    $("#cg_filter .cancel").on("click", e => {
      this.pageIndex = 1;
      //console.log(e.target);
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");
      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.filter_fixedSupplier = 0;
      this.filter_LastTransaction = 0;
      this.filter_ismidpacking = 0;

      //自定义字段输入框禁用
      $('#cg_filter .customFilter .searchWords').each(function(i,ele){
        $(ele).val('').prop('disabled',true);
      })

      //请求数据
      this.showLoading = true;
      this.$http
        .post(this.url+"getlist", {
          id: this.id,
          type: Number(this.showCanBuy),
          OverStock: Number(this.OverStock),
          PurchaseSpxq: Number(this.PurchaseSpxq),
          PriceChange: Number(this.PriceChange),
          sorting: this.sorting,
          filter_select: 0,
          filter_pricetype: 0,
          filter_source: 0,
          filter_fixedSupplier:0,
          filter_LastTransaction:0,
          ismidpacking:0
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

    //3.删选模态框自定义字段radio切换
    $('#cg_filter').on('change',".customFilter input[type='radio']",function(e){
      var $customRadio = $(e.target);
      if($customRadio.val() == '2'){
        // $customRadio.parent().next().prop('disabled',false);
        $customRadio.parents('.form-group').find('.searchWords').prop('disabled',false);
      }else{
        $customRadio.parents('.form-group').find('.searchWords').prop('disabled',true).val('');
      }
    })

    //4.自定义字段点击精准搜索的输入框 , 精准搜索的radio选中
    $('#cg_filter').on('click','.customFilter .searchWordsContainer',function(){
      var $this = $(this);
       $this.find(':radio').prop('checked',true);
      $this.children(':text').prop('disabled',false);
    })


    //页面滚动时让fixed_top固定在顶部
    var $fixed_top = $(".fixed_top");
    var $box = $('.content>.box');
    var offsetTop = $fixed_top.offset().top;
    var left=$fixed_top.offset().left;//顶部固定条距离窗口左侧的距离
    var scrollLeft=0;
    $(window).scroll((e)=> {
      if(moveTimer!=null){
        clearInterval(moveTimer);
        moveTimer = null;
      }
      var $this=$(e.target);

      scrollLeft=$this.scrollLeft();
      if(scrollLeft>10){
        this.showShadow=true;
      }else{
        this.showShadow=false;
      }
      if ($this.scrollTop() > offsetTop) {
        $fixed_top.css({
          position: "fixed",
          top: 0,
          // left:this.offsetLeft-scrollLeft
          left:$(".detail")[0].getBoundingClientRect().left
        });
        $box.addClass('helpFixed');
          
      } else {
        $fixed_top.css({
          position: "static"
        });
        $box.removeClass('helpFixed');
      }
    });
    
    $(window).resize(()=>{
      $fixed_top.css({
          left:$(".detail")[0].getBoundingClientRect().left
        });
    })

    window.onbeforeunload=()=>{
      if(this.list.data.ExceptionField){
        for(var item of this.list.data.ExceptionField){
          localStorage[this.id + item.customName] = item.show;
        }
      }
      if( !this.OverStock && !this.PurchaseSpxq && !this.PriceChange){  
        localStorage[ this.id] = $(window).scrollTop();
        localStorage[this.id+'sorting'] = this.sorting;
        localStorage[this.id+'showCanBuy'] = Number(this.showCanBuy);
        localStorage[this.id+'nowTrIndex'] = this.nowTrIndex;
        localStorage[this.id+'PageIndex'] = this.list.data.PageIndex;
        localStorage[this.id+'PageSize'] = this.list.data.PageSize;
      }else{
        localStorage[ this.id] = 0;
      }
    }

    // 滚动至上次浏览位置
    var top = localStorage[ this.id];
    var moveTimer = null;
    var that = this;
    if(top > 0){
      moveTimer = setInterval(function(){
        var hasScroll = $(window).scrollTop();
        if( hasScroll == top ){
          clearInterval(moveTimer);
          moveTimer = null;
          that.myToast('已为您滚动至上次浏览位置!')
        }else{
          $('html:not(:animated),body').animate({
            scrollTop:top
          },300)
        }
      },500)
    }


    //cg_preference模态框关闭事件 将showCGPH 置为false
    $('#cg_preference').on('hidden.bs.modal',()=>{
      this.showCGPH = false;
    })
    

    //滚动
    var lastPress = new Date();
    var nowPress = null;
    $(window).keydown((e)=>{
      if(e.keyCode == 40 && this.nowTrIndex!=null){
        var Scroll = $(window).scrollTop();
        nowPress=new Date();
        if(nowPress-lastPress>300){
          $('html:not(:animated),body').animate({
            scrollTop:Scroll+this.nextScrollHeight
          },'slow','linear')
          this.nowTrIndex++;
          this.prevScrollHeight = this.nextScrollHeight;
          this.nextScrollHeight = $(`.product_container tr:eq(${this.nowTrIndex+1})`).outerHeight() || 0;
          
          lastPress = nowPress;
        }
      }else if(e.keyCode == 38 && this.nowTrIndex!=null){
        var Scroll = $(window).scrollTop();
        nowPress=new Date();
        if(nowPress-lastPress>300){
          $('html:not(:animated),body').animate({
            scrollTop:Scroll-this.prevScrollHeight
          },'normal','linear')
          this.nextScrollHeight = $(`.product_container tr:eq(${this.nowTrIndex})`).outerHeight() || 0;
          this.nowTrIndex--;
          this.prevScrollHeight = $(`.product_container tr:eq(${this.nowTrIndex-1})`).outerHeight() || 0;
        }
      }
    })

  },
  beforeUpdate(){
    $("[data-toggle='tooltip']").tooltip('destroy');
    $("[data-toggle='popover']").popover('destroy');
    $("input[name='exception']").unbind();
  },
  updated() { 
    
    //console.log("已更新!")
    // this.offsetLeft = $(".fixed_top").offset().left;
    //启用tooltip
    $("[data-toggle='tooltip']").tooltip();
    //启用popover
    $("[data-toggle='popover']").popover({
      html:true,
      trigger: "hover",
      container: "body"
    });

    //采购偏好设置中例外条件
    //console.log( $("input[name='exception']") );
    $("input[name='exception']").change((e)=>{
        var $this =  $(e.target);
        if($this.val()==1){
            $('#cg_preference input.percent').prop('disabled',false);
        }else{
            $('#cg_preference input.percent').prop('disabled',true);
            this.list.data.LimitPercentage = 0;
        }
    })

  },
  methods: {
    //获取谷歌浏览器版本
    getChromeVersion() {
      var arr = navigator.userAgent.split(' '); 
      var chromeVersion = '';
      for(var i=0;i < arr.length;i++){
          if(/chrome/i.test(arr[i]))
          chromeVersion = arr[i]
      }
      if(chromeVersion){
          return Number(chromeVersion.split('/')[1].split('.')[0]);
      } else {
          return false;
      }
    },
    //判断是否为IE
    IEBrowser(){
      if(!!window.ActiveXObject || "ActiveXObject" in window){
        return true;
      }else{
        return false;
      }
    },
    //请求数据函数
    getData() {
      this.showLoading = true;
      this.$http
        .post(this.url+"getlist", {
          id: this.id,
          type: Number(this.showCanBuy),
          OverStock: Number(this.OverStock),
          PurchaseSpxq: Number(this.PurchaseSpxq),
          PriceChange: Number(this.PriceChange),
          sorting: this.sorting,
          filter_select: this.filter_select,
          filter_pricetype: this.filter_pricetype,
          filter_source: this.filter_source,
          filter_fixedSupplier: this.filter_fixedSupplier,
          filter_LastTransaction:this.filter_LastTransaction,
          ismidpacking:this.filter_ismidpacking,
          pageIndex : this.pageIndex,
          pageSize : this.pageSize
        })
        .then(res => {
          if (res.data.success) {
            this.list = res.data;
            this.showLoading = false;
             //console.log(this.list);
            //如果价格或者店铺数量发生变化,重新请求数据
            if (res.data.data.isCompanyChange || res.data.data.isChange) {
              this.showLoading = true;
              var params = new URLSearchParams();
              params.append("id", this.id);
              if (res.data.data.isChange) {
                params.append("PriceChange", 1);
                this.myConfirm("卖家价格发生变化,正在更新采购计划中的价格");
                
                this.$http.post(this.url+"ChangePricePurchasePlan", params).then(res => {
                  if (res.data.success) {
                    //重新计算成功,在次重新请求数据
                    this.$http
                      .post(this.url+"getlist", {
                        id: this.id,
                        type: Number(this.showCanBuy),
                        OverStock: Number(this.OverStock),
                        PurchaseSpxq: Number(this.PurchaseSpxq),
                        PriceChange: Number(this.PriceChange),
                        sorting: this.sorting,
                        filter_select: this.filter_select,
                        filter_pricetype: this.filter_pricetype,
                        filter_source: this.filter_source,
                        filter_fixedSupplier: this.filter_fixedSupplier,
                        filter_LastTransaction:this.filter_LastTransaction,
                        ismidpacking:this.filter_ismidpacking,
                        pageIndex : this.pageIndex,
                        pageSize : this.pageSize
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
                }).catch(err => {
                  this.showLoading = false;
                  this.myToast("网络错误,请重试!");
                });

              } else {
                this.myConfirm("采购的卖家数量发生变动,正在重新生成采购计划");
                
                this.$http.post(this.url+"ChangePurchasePlan", params).then(res => {
                  if (res.data.success) {
                    //重新计算成功,在次重新请求数据
                    this.$http
                      .post(this.url+"getlist", {
                        id: this.id,
                        type: Number(this.showCanBuy),
                        OverStock: Number(this.OverStock),
                        PurchaseSpxq: Number(this.PurchaseSpxq),
                        PriceChange: Number(this.PriceChange),
                        sorting: this.sorting,
                        filter_select: this.filter_select,
                        filter_pricetype: this.filter_pricetype,
                        filter_source: this.filter_source,
                        filter_LastTransaction:this.filter_LastTransaction,
                        ismidpacking:this.filter_ismidpacking,
                        pageIndex : this.pageIndex,
                        pageSize : this.pageSize
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
                }).catch(err => {
                  this.showLoading = false;
                  this.myToast("网络错误,请重试!");
                });
              }
              
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
    //重新计算productList,便于循环
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
      this.pageIndex = 1;
      //清楚筛选条件
      $("#cg_filter .default").prop("checked", true);
      $(".box_header .filter_num").text("");

      this.filter_select = 0;
      this.filter_pricetype = 0;
      this.filter_source = 0;
      this.filter_fixedSupplier = 0;
      this.filter_LastTransaction = 0;
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
        .post(this.url+"PurchasePlanSelectMiniPirce", {
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

      if(!this.productList[ind].openMultiple){
        this.productList[ind].sellerJson1[key].selected = false;
        this.productList[ind].sellerJson1[key].prevSelected = true;
        this.productList[ind].isSelect = false;
        this.checkall = false;
        if (this.productList[ind].outTop1) {
          this.productList[ind].outTop0 = true;
          this.productList[ind].outTop1 = false;
          this.list.data.CountPurchaseSock--;
        }
        //计算节省金额
        if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
          var save = (this.productList[ind].HistoryPrice-(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price))*this.productList[ind].BuyCount;
          this.list.data.SelectSavePriceAll -=save;
          this.list.data.SelectPriceAll -= this.productList[ind].BuyCount*(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);
        }

        //修改sellerJsonValid
        this.productList[ind].sellerJsonValid.forEach(function(ele,i){
          ele.selected = false;
        })
        
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
          .post(this.url+"PurchasePlanSetisSelect", {
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
      }else if(this.productList[ind].openMultiple){
        //在多选状态下,取消勾选商品
        var multipleCount=0,
            overdue = 0;
        this.productList[ind].sellerJson1.forEach((ele,i)=>{
          if(ele.buyCount>0){
            multipleCount++;
            if(i == key){
              var price = ele.price;
              //console.log(price*ele.buyCount);
              this.list.data.purchasingCompanyList[key].Total-=(price*ele.buyCount);
            }
            if(ele.overdue){
              overdue++;
            }
          } 
        })
        if(multipleCount==1){
          //在多选状态下,取消勾选,但是只有一个商品
          this.productList[ind].isSelect=false;
          this.productList[ind].openMultiple = false;
          this.productList[ind].sellerJson1[key].selected = false;
          this.productList[ind].sellerJson1[key].preSelected = true;

          //已选商品数
          this.list.data.ProductCountSelect--;
          if(this.productList[ind].sellerJson1[key].overdue){
            this.list.data.CountSpxq--;
          }

          //发送修改购买数量
           var params = new URLSearchParams();
            params.append("id", this.productList[ind].id);
            params.append("BuyCount", this.productList[ind].BuyCount);
          this.$http.post(this.url+'PurchasePlanModifyBuyCount',params).then(res=>{
            // console.log(res.data)
          }).catch(err=>{
            this.myConfirm("网络错误,请重试!");
          })

          //发送此商品未选中
          var obj = {};
          obj[this.productList[ind].id] = false;
          var str = "";
          for (var ak in obj) {
            str += ak + ":";
            str += obj[ak] + ",";
          }
          //console.log(str);
          this.$http.post(this.url+"PurchasePlanSetisSelect", {
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

        }else{
          this.productList[ind].sellerJson1[key].selected = false;
          this.productList[ind].sellerJson1[key].preSelected = false;
          if(overdue == 1 && this.productList[ind].sellerJson1[key].overdue) this.list.data.CountSpxq--;
          //向服务器发送数据
          var storeid = this.productList[ind].sellerJson1[key].storeid,
              BuyCount = 0,
              bargain = this.productList[ind].sellerJson1[key].bargain,
              id = this.productList[ind].id;
          this.multiplePost(id,storeid,BuyCount,bargain);
        }

        //计算节省金额
          if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
            var save = (this.productList[ind].HistoryPrice-(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price))*this.productList[ind].sellerJson1[key].buyCount;
            this.list.data.SelectSavePriceAll -=save;
            this.list.data.SelectPriceAll -= this.productList[ind].sellerJson1[key].buyCount*(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);
          }
        //console.log(ind,key);
        this.productList[ind].sellerJson1[key].buyCount=0;
        
         

      }
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
      if (!this.productList[ind].sellerJson1[key].selected && !this.productList[ind].openMultiple && this.productList[ind].sellerJson1[key].storeid != 0) {
        // this.productList[ind].Goods_Pcs_Small = this.productList[ind].sellerJson1[key].Goods_Pcs_Small;  //改变中包装倍数
        this.productList[ind].Goods_Pcs_Small = this.productList[ind].sellerJson1[key].ismidpacking ? this.productList[ind].sellerJson1[key].Goods_Pcs_Small : 1;  //改变中包装倍数
        var bargain = 0;
        var hasSelect = 0;
        var preSelectIndex = null;
        this.productList[ind].sellerJson1.forEach((ele, i) => {
          if (ele && ele.selected) {
            hasSelect++;
            preSelectIndex = i; //之前选中的商品的下标
            if(i!==key){
              //小计更新
              var price = ele.price,
                buyCount = this.productList[ind].BuyCount;
              this.list.data.purchasingCompanyList[i].Total -= price * buyCount;
            }
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
              if (this.productList[ind].outTop1 && !ele.offline) {
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
            
            //判断wrongPrice
            if(this.productList[ind].HistoryPrice > 0 && (this.productList[ind].HistoryPrice >= this.productList[ind].Price * 2 || this.productList[ind].Price >= this.productList[ind].HistoryPrice * 2)){
              this.productList[ind].wrongPrice = true;
            }else{
              this.productList[ind].wrongPrice = false;
            }


          } else {
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
          //计算节省金额
          if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
            //当修改后的购买数量大于之前的购买数量
              var save= this.productList[ind].BuyCount*(this.productList[ind].HistoryPrice - (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price));
              this.list.data.SelectSavePriceAll +=save;
              this.list.data.SelectPriceAll += this.productList[ind].BuyCount * (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);
          
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

          //计算节省金额
          //减去之前商品的节省金额
          if(this.productList[ind].HistoryPrice > 0 && (this.productList[ind].HistoryPrice >=  this.productList[ind].sellerJson1[preSelectIndex].price*2 ||  this.productList[ind].sellerJson1[preSelectIndex].price >= this.productList[ind].HistoryPrice*2)){
              //之前选中也是wrongPrice价格
            
            var nowSave = this.productList[ind].BuyCount*(this.productList[ind].HistoryPrice - (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price));
            this.list.data.SelectSavePriceAll +=nowSave;
            this.list.data.SelectPriceAll += this.productList[ind].BuyCount * (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);

          }else if(this.productList[ind].HistoryPrice > 0 && !this.productList[ind].wrongPrice){

            var preSave= this.productList[ind].BuyCount*(this.productList[ind].HistoryPrice - (this.productList[ind].sellerJson1[preSelectIndex].bargain || this.productList[ind].sellerJson1[preSelectIndex].price));
            // console.log("presave"+preSave);
            this.list.data.SelectSavePriceAll -=preSave;
            this.list.data.SelectPriceAll -= this.productList[ind].BuyCount * (this.productList[ind].sellerJson1[preSelectIndex].bargain || this.productList[ind].sellerJson1[preSelectIndex].price);

            var nowSave = this.productList[ind].BuyCount*(this.productList[ind].HistoryPrice - (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price));
            // console.log('nowSave'+nowSave);
            this.list.data.SelectSavePriceAll +=nowSave;
            this.list.data.SelectPriceAll += this.productList[ind].BuyCount * (this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);
          }

        }
        var storeid = this.productList[ind].sellerJson1[key].storeid;
        this.productList[ind].sellerJsonValid.forEach((ele,i)=>{
          ele.selected = false;
          if(ele.storeid == storeid){
             ele.selected = true;
          }
        })
        //向服务器发送数据选中的商品
        this.$http
          .post(this.url+"PurchasePlanChangeStoreid", {
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
          .post(this.url+"PurchasePlanSetisSelect", params)
          .then(res => {
            if (!res.data.success) {
              this.myConfirm(res.data.info);
            }
          })
          .catch(err => {
            this.myToast("网络错误,请重试!");
          });
      } else if((this.productList[ind].sellerJson1[key].selected && !this.productList[ind].openMultiple && this.productList[ind].sellerJson1[key].storeid != 0) || (this.productList[ind].sellerJson1[key].buyCount>0 && this.productList[ind].openMultiple && this.productList[ind].sellerJson1[key].storeid != 0)) {
        //如果已勾选或者为多选供应商 buyCount>0 ,则开启议价窗口
        if (this.productList[ind].sellerJson1[key].offline) {
          this.myToast("线上商品才能议价");
          return;
        }
        // console.log(this.productList[ind].sellerJson1[key].buyCount);
        // console.log(this.productList[ind].openMultiple);
        $(".yjModal .post").data({
          productIndex: ind,
          storeIndex: key,
          purchaselistid: this.productList[ind].id,
          storeid: this.list.data.purchasingCompanyList[key].storeid,
          buyCount:this.productList[ind].sellerJson1[key].buyCount,
          openMultiple:this.productList[ind].openMultiple
        });
        $(".yjModal .companyName").text(
          this.list.data.purchasingCompanyList[key].CompanyName
        );
        //console.log(this.list.data.purchasingCompanyList[key].CompanyName);
        $(".yjModal .price").text(this.productList[ind].sellerJson1[key].price);
        $(".yjModal .historyPrice").text(this.productList[ind].HistoryPrice);
        $(".yjModal .input").val(this.productList[ind].sellerJson1[key].bargain);
        $(".yjModal").show();
      } else if(this.productList[ind].openMultiple && this.productList[ind].sellerJson1[key].buyCount==0 && this.productList[ind].sellerJson1[key].storeid != 0){
        //已经开启供应商多选且未选中此商品 buyCount的值为初始想购买的数量减去已经购买的数量
        var initialBuyCount = this.productList[ind].BuyCount;
        var hasOverdue = 0;
        this.productList[ind].sellerJson1.forEach((p,k)=>{
          initialBuyCount-=p.buyCount;
          if(p && p.buyCount>0 && p.overdue && k!=key){
            hasOverdue++;
          }
        })
        var Goods_Pcs_Small = this.productList[ind].sellerJson1[key].Goods_Pcs_Small;
        var balance = initialBuyCount%Goods_Pcs_Small;
        if(initialBuyCount-balance>0 && Goods_Pcs_Small>1){
          initialBuyCount+=(Goods_Pcs_Small-balance)
        }
        //近效期数量变化
        if(this.productList[ind].sellerJson1[key].overdue && hasOverdue==0){
          this.list.data.CountSpxq++;
        }
   
        //当前选择的供应商库存大于未购买的数量  ...
        if( this.productList[ind].sellerJson1[key].stock >= initialBuyCount && initialBuyCount>=0 ){
          this.productList[ind].sellerJson1[key].buyCount = initialBuyCount || 1;
        }else if( this.productList[ind].sellerJson1[key].stock < initialBuyCount && initialBuyCount>=0 ){
          this.productList[ind].sellerJson1[key].buyCount = this.productList[ind].sellerJson1[key].stock;
        }
        if(initialBuyCount<0){
          this.productList[ind].sellerJson1[key].buyCount = 1;
        }
        var price = this.productList[ind].sellerJson1[key].price;
        this.list.data.purchasingCompanyList[key].Total+=price * this.productList[ind].sellerJson1[key].buyCount;
        
        var storeid = this.productList[ind].sellerJson1[key].storeid,
            BuyCount = this.productList[ind].sellerJson1[key].buyCount,
            bargain = this.productList[ind].sellerJson1[key].bargain,
            id = this.productList[ind].id;

        //修改节省金额
        if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
          var save = (this.productList[ind].HistoryPrice-(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price))*this.productList[ind].sellerJson1[key].buyCount;
          this.list.data.SelectSavePriceAll +=save;
          this.list.data.SelectPriceAll += this.productList[ind].sellerJson1[key].buyCount*(this.productList[ind].sellerJson1[key].bargain||this.productList[ind].sellerJson1[key].price);
        }
        //向服务器发送数据
        this.multiplePost(id,storeid,BuyCount,bargain);

      } else if( this.productList[ind].sellerJson1[key].storeid == 0  && !this.productList[ind].openMultiple){
        $('.offlineModal .post').data('index',ind).data('key',key);
         this.offlineModalData = this.productList[ind].sellerJsonValid;
        if(!this.productList[ind].isSelect){
          this.offlineModalData.forEach((valid,validKey)=>{
            valid.selected = false;
          })
        }
       
      }else if(this.productList[ind].sellerJson1[key].storeid == 0 && this.productList[ind].isSelect && this.productList[ind].openMultiple){
        this.myToast("已开启线上多选,无法选择线下供应商!");
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
      //console.log(this.productList[ind].BuyCount0);
      var prevBuyCount=this.productList[ind].BuyCount0
      var val = parseInt(e.target.value);
      // console.log(val);
      if (isNaN(val) || val <= 0) {
        val = 1;
        //this.productList[ind].isSelect=false;
      }
      this.productList[ind].BuyCount = val;
      this.$set(this.productList,ind,this.productList[ind]);

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
          //计算节省金额
          if(this.productList[ind].HistoryPrice>0){
            //当修改后的购买数量大于之前的购买数量
            if(val>prevBuyCount){
              var save= (val-prevBuyCount)*(this.productList[ind].HistoryPrice - price);
              this.list.data.SelectSavePriceAll +=save;
              this.list.data.SelectPriceAll += (val-prevBuyCount)*price;
            }else if(val<prevBuyCount){
              var save= (prevBuyCount - val) * (this.productList[ind].HistoryPrice - price);
              this.list.data.SelectSavePriceAll -= save;
              this.list.data.SelectPriceAll -= (prevBuyCount - val)*price;
            }
          
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
        .post(this.url+"PurchasePlanModifyBuyCount", {
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
      if (this.productList[ind].BranchesJson != null &&this.productList[ind].isSelect ) {
        var html = "<div class='editBox'>";
        var arr = this.productList[ind].BranchesJson;
        //console.log(arr.length);
        for (var i = 0; i < arr.length; i++) {
          html += `<p class="row">
            <span class="left col-xs-4">${arr[i].NameBranches}</span>
            <span class="right col-xs-4">
              <input style="width:100px;" data-id=${
                arr[i].id
              } data-branchesindex=${i} value=${
            arr[i].BuyCount
          } class="input form-control" type='number'/>
            </span>
             <i class="fa fa-minus-circle" aria-hidden="true" title="删除"></i>
          </p>`;
        }
        html += `</div><p class="row"><span class="left col-xs-4">${this.list.data.BranchesList.length>0?'<button class="btn btn-default fa fa-plus">新增采购门店</button>':''}</span></p><p class="row">
            <span class="left col-xs-4">总计</span>
            <span class="right total col-xs-8">${
              this.productList[ind].BuyCount
            }</span>
          </p>`;
        $(".branchesModal .branchesContent").html(html);
        $(".branchesModal .post").data("productIndex", ind);
        $(".branchesModal .post").data("psn", this.productList[ind].PSN);
        $(".branchesModal").slideDown();
      } else if (this.productList[ind].BranchesCount > 0) {
        try {
            e.target.blur();
        } catch (error) {
          
        } 
      }
    },
    showBranchesModal2(ind){
      if(this.productList[ind].isSelect && this.list.data.BranchesList.length>0 && this.productList[ind].BranchesJson == null ){
          var html = "<div class='editBox'>";

          html += `<p class="row">
            <span class="left col-xs-4">${this.list.data.BranchesList[0]}</span>
            <span class="right col-xs-4">
              <input style="width:100px;"  value=${
            this.productList[ind].BuyCount
          } class="input form-control" type='number'/>
            </span>
             <i class="fa fa-minus-circle" aria-hidden="true" title="删除"></i>
          </p>`;

        html += `</div><p class="row"><span class="left col-xs-4">${this.list.data.BranchesList.length>0?'<button class="btn btn-default fa fa-plus">新增采购门店</button>':''}</span></p><p class="row">
            <span class="left col-xs-4">总计</span>
            <span class="right total col-xs-8">${
              this.productList[ind].BuyCount
            }</span>
          </p>`;
        $(".branchesModal .branchesContent").html(html);
        $(".branchesModal .post").data("productIndex", ind);
        $(".branchesModal .post").data("psn", this.productList[ind].PSN);
        $(".branchesModal").slideDown();
      }else if(this.productList[ind].isSelect && this.list.data.BranchesList.length>0 && this.productList[ind].BranchesJson != null){
        var html = "<div class='editBox'>";
        for(var item of this.productList[ind].BranchesJson){
          html += `<p class="row">
            <span class="left col-xs-4">${item.NameBranches}</span>
            <span class="right col-xs-4">
              <input style="width:100px;"  value=${
            item.BuyCount
          } class="input form-control" type='number'/>
            </span>
             <i class="fa fa-minus-circle" aria-hidden="true" title="删除"></i>
          </p>`;
        }
        html += `</div><p class="row"><span class="left col-xs-4">${this.list.data.BranchesList.length>0?'<button class="btn btn-default fa fa-plus">新增采购门店</button>':''}</span></p><p class="row">
            <span class="left col-xs-4">总计</span>
            <span class="right total col-xs-8">${
              this.productList[ind].BuyCount
            }</span>
          </p>`;
        $(".branchesModal .branchesContent").html(html);
        $(".branchesModal .post").data("productIndex", ind);
        $(".branchesModal .post").data("psn", this.productList[ind].PSN);
        $(".branchesModal").slideDown();
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
      if(this.productList.length==0) return;
      var obj = {};
      //取消勾选
      if (!e.target.checked) {
        //计算已选择商品数
        var checkNum = 0;
        //计算小计
        this.productList.forEach((item, ind) => {
          if(item.isSelect){
            checkNum++;
          }
          var buyCount = item.BuyCount;
          var hasOverdue = 0; //多选状态下近效期
          item.sellerJson1.forEach((product, index) => {
            if (item.isSelect && product && product.selected &&!item.openMultiple) {
                //未开启多选供应商计算小计
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
                //this.$set(this.productList,ind,this.productList[ind])
              }
              if (product.overdue) this.list.data.CountSpxq--; //近效期
              //计算节省金额
              if(item.HistoryPrice>0 && !item.wrongPrice){
                var save = (item.HistoryPrice-(product.bargain||product.price))*buyCount;
                this.list.data.SelectSavePriceAll -= save;
                this.list.data.SelectPriceAll -= buyCount * (product.bargain||product.price);
                //console.log(this.list.data.SelectSavePriceAll,this.list.data.SelectPriceAll);
              }

            }else if(item.isSelect && item.openMultiple && product && product.buyCount>0){
              this.list.data.purchasingCompanyList[index].Total -= (product.price * product.buyCount);
              if(item.multipleOutTop){
                this.list.data.CountPurchaseSock--;
                item.multipleOutTop = false;
              }
              //计算多选模式节省金额
              if(!item.wrongPrice && item.HistoryPrice>0){
                var save = (item.HistoryPrice-(product.bargain||product.price))*product.buyCount;
                this.list.data.SelectSavePriceAll -=save;
                this.list.data.SelectPriceAll -= product.buyCount*(product.bargain||product.price);
              }
              

              if(product.overdue) hasOverdue++;
              

            }

          });
          if(hasOverdue>0) this.list.data.CountSpxq--;
        });

        // this.list.data.SelectSavePriceAll = 0;
        // this.list.data.SelectPriceAll = 0;

        
        // this.productList.forEach((ele, i) => {
        //   if (ele.isSelect) checkNum++;
        // });
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
          ele.sellerJsonValid.forEach((valid,validKey)=>{
            valid.selected = false;
          })

        });
      } else {
        this.productList.forEach((item, ind) => {
          var buyCount = item.BuyCount;
          var hasOverdue = 0;
          item.sellerJson1.forEach((product, index) => {
            if (product.canSelect && product.prevSelected && !item.isSelect && !item.openMultiple) {
              var stock=product.stock;
              //单选模式下小计累加上去
              this.list.data.purchasingCompanyList[index].Total += buyCount * product.price;
              //if (item.outTop1) this.list.data.CountPurchaseSock++; 
              if(buyCount>stock){//超库存
                this.list.data.CountPurchaseSock++;
                item.outTop0=true;
                item.outTop1=true;
                //this.$set(this.productList,ind,this.productList[ind])
              }
              if (product.overdue) this.list.data.CountSpxq++; //近效期
              //计算节省金额
              if(item.HistoryPrice>0 && !item.wrongPrice){
                //console.log(item.DrugsBase_DrugName);
                var save = (item.HistoryPrice-(product.bargain||product.price))*buyCount;
                this.list.data.SelectSavePriceAll +=save;
                this.list.data.SelectPriceAll += buyCount * (product.bargain||product.price);
              }
            }else if(product.canSelect && item.openMultiple && product.buyCount>0 && !item.isSelect){
              this.list.data.purchasingCompanyList[index].Total += product.buyCount * product.price;
              if(product.buyCount > product.stock && !item.multipleOutTop){
                this.list.data.CountPurchaseSock++;
                item.multipleOutTop= true ;
              }
              //计算多选模式节省金额
              if(!item.wrongPrice && item.HistoryPrice>0){
                var save = (item.HistoryPrice-(product.bargain||product.price))*product.buyCount;
                this.list.data.SelectSavePriceAll +=save;
                this.list.data.SelectPriceAll += product.buyCount*(product.bargain||product.price);
              }
              //计算多选近效期
              if(product.overdue) hasOverdue++;

            }
          });
          if(hasOverdue>0) this.list.data.CountSpxq++;
        });

        ////计算已选择商品数
        var checkNum = 0;
        // this.productList.forEach((ele, i) => {
        //   if (ele.canBuy && !ele.isSelect) checkNum++;
        // });
        
        this.productList.forEach((ele, i) => {
          if (ele.canBuy) {
            ele.isSelect = true;
            obj[ele.id] = true;
          }
          if (ele.canBuy && !ele.isSelect) {
            checkNum++;
          }
          ele.sellerJson1.forEach((item, i) => {
            if (item && item.prevSelected) {
              item.selected = true;
              var validStoreid = item.storeid;
              ele.sellerJsonValid.forEach((valid,validKey)=>{
                if(valid.storeid == validStoreid){
                  valid.selected = true;
                }
              })
            }
          });
        });
        this.list.data.ProductCountSelect += checkNum;
      }
      //发送所有商品是否选中数据
      var str = "";
      for (var key in obj) {
        str += key + ":";
        str += obj[key] + ",";
      }
      if(str == "") return;
      this.$http.post(this.url+"PurchasePlanSetisSelect", {
          data: str
        }).then(res => {
          if(!res.data.success){
            if(res.data.info=="请先登录"){
              $('.loginConfirm').fadeIn();
            }else{
              this.myToast(res.data.info);
            }
          }
        }).catch(err => {
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
          bargain = null,
          buyCount = this.productList[ind].BuyCount,
          storeid = null;

        var len = this.productList[ind].sellerJson1.length;
        for (var i = 0; i < len; i++) {
          if (this.productList[ind].sellerJson1[i] &&this.productList[ind].sellerJson1[i].prevSelected){
            this.productList[ind].sellerJson1[i].selected = true;
            
            // console.log(this.productList[ind].sellerJson1[i].selected);
            productIndex = i;
            price = this.productList[ind].sellerJson1[i].price;
            stock = this.productList[ind].sellerJson1[i].stock;
            bargain = this.productList[ind].sellerJson1[i].bargain;
          }
          //sellerJson1中的buyCount >0 为多选商品 小计计算
          if(this.productList[ind].sellerJson1[i]&&this.productList[ind].sellerJson1[i].buyCount>0){
            //console.log('商品的下标为'+i+'buyCount为'+this.productList[ind].sellerJson1[i].buyCount);
            this.list.data.purchasingCompanyList[i].Total += (this.productList[ind].sellerJson1[i].price * this.productList[ind].sellerJson1[i].buyCount);
          }

        }
        
        //没有上次勾选的商品
        var IsMatchJxq=this.list.data.IsMatchJxq,
            IsMatchNotStock=this.list.data.IsMatchNotStock;
        
        if(productIndex==null){
          //console.log("没有上次勾选的商品")
          for(var k=0,minPrice=999999;k<len;k++){
            if(this.productList[ind].sellerJson1[k] && this.productList[ind].sellerJson1[k].canSelect){ 
              //console.log('有商品')
              if(IsMatchJxq && IsMatchNotStock && this.productList[ind].sellerJson1[k].price<minPrice) {
                minPrice=this.productList[ind].sellerJson1[k].price;
                productIndex = k;
                price = this.productList[ind].sellerJson1[k].price;
                stock = this.productList[ind].sellerJson1[k].stock;
              }else if(!IsMatchJxq && !IsMatchNotStock && !this.productList[ind].sellerJson1[k].overdue && this.productList[ind].sellerJson1[k].price<minPrice){
                if(this.productList[ind].sellerJson1[k].stock>=buyCount){
                  minPrice=this.productList[ind].sellerJson1[k].price;
                  productIndex = k;
                  price = this.productList[ind].sellerJson1[k].price;
                  stock = this.productList[ind].sellerJson1[k].stock;
                }
                
              }else if(IsMatchJxq  && !IsMatchNotStock  && this.productList[ind].sellerJson1[k].price<minPrice){
                if(this.productList[ind].sellerJson1[k].stock>=buyCount){
                  minPrice=this.productList[ind].sellerJson1[k].price;
                  productIndex = k;
                  price = this.productList[ind].sellerJson1[k].price;
                  stock = this.productList[ind].sellerJson1[k].stock;
                }
              }else if(!IsMatchJxq && IsMatchNotStock && !this.productList[ind].sellerJson1[k].overdue && this.productList[ind].sellerJson1[k].price<minPrice){
                  minPrice=this.productList[ind].sellerJson1[k].price;
                  productIndex = k;
                  price = this.productList[ind].sellerJson1[k].price;
                  stock = this.productList[ind].sellerJson1[k].stock;
              }

            }
            
          }
          //自动帮用户勾上之后

          if(productIndex!=null){
            // console.log(productIndex);
            this.productList[ind].sellerJson1[productIndex].selected = true;
            this.productList[ind].sellerJson1[productIndex].prevSelected = true;
            this.$http.post(this.url+"PurchasePlanChangeStoreid", {
              id: this.productList[ind].id,
              storeid: this.list.data.purchasingCompanyList[productIndex].storeid,
              bargain: this.productList[ind].sellerJson1[productIndex].bargain
            }).then(res => {
              if(!res.data.success){
                if(res.data.info=="请先登录"){
                  $('.loginConfirm').fadeIn();
                }else{
                  this.myToast(res.data.info);
                }
              }
            }).catch(err => {
              //console.log(err);
              this.myConfirm("网络错误,请重试!");
            });
            
          }

        }

        this.productList[ind].sellerJsonValid.forEach((ele,i)=>{
          if(ele.storeid == this.productList[ind].sellerJson1[productIndex].storeid){
            ele.selected = true;
          }
        })  

        //小计变化
        if (productIndex != null) {
          if(!this.productList[ind].openMultiple){
            this.list.data.purchasingCompanyList[productIndex].Total += price * buyCount;
          }
          
          //更新对比价格
          this.productList[ind].Price=this.productList[ind].sellerJson1[productIndex].price;
          //近效期数量变化
          if (this.productList[ind].sellerJson1[productIndex].overdue && !this.productList[ind].openMultiple) {
            this.list.data.CountSpxq++;
          }else if(this.productList[ind].openMultiple){
            var hasOverdue = 0;
            this.productList[ind].sellerJson1.forEach((p,k)=>{
              if(p && p.buyCount>0 && p.overdue){
                hasOverdue++;
              }
            })
            if(hasOverdue>0) this.list.data.CountSpxq++;
          }
          //计算节省金额
          if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice && !this.productList[ind].openMultiple){
            var save = (this.productList[ind].HistoryPrice-(bargain||price))*buyCount;
            this.list.data.SelectSavePriceAll +=save;
            this.list.data.SelectPriceAll += (bargain||price)*buyCount;
          }else if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice && this.productList[ind].openMultiple){
            this.productList[ind].sellerJson1.forEach((seller,sk)=>{
                if(seller.buyCount > 0){
                  var save = (this.productList[ind].HistoryPrice-(this.productList[ind].sellerJson1[sk].bargain||this.productList[ind].sellerJson1[sk].price))*this.productList[ind].sellerJson1[sk].buyCount;
                  this.list.data.SelectSavePriceAll +=save;
                  this.list.data.SelectPriceAll += this.productList[ind].sellerJson1[sk].buyCount*(this.productList[ind].sellerJson1[sk].bargain||this.productList[ind].sellerJson1[sk].price);
                }
 
            })
          }
        }

        //计算超库存
        if (stock!=null && buyCount>stock && !this.productList[ind].openMultiple) {
           this.list.data.CountPurchaseSock++;
          this.productList[ind].outTop0=true;
          this.productList[ind].outTop1=true;
          //this.$set(this.productList,ind,this.productList[ind]);
         // console.log(this.productList[ind]);
        }
        if(this.productList[ind].openMultiple && this.productList[ind].multipleOutTop){
          this.list.data.CountPurchaseSock++;
        }
        //计算已选择商品数
        this.list.data.ProductCountSelect++;
      } else {
        //取消勾选
        //计算已选择商品数
        this.list.data.ProductCountSelect--;
        //超库存数
        if ((this.productList[ind].outTop1 && !this.productList[ind].openMultiple) || (this.productList[ind].openMultiple && this.productList[ind].multipleOutTop)) {
           this.list.data.CountPurchaseSock--;
          this.productList[ind].outTop1 = false;
          this.$set(this.productList,ind,this.productList[ind]);
        }
        var productIndex = null,
          price = null,
          bargain = null,
          buyCount = this.productList[ind].BuyCount;
        this.productList[ind].sellerJson1.forEach((ele, i) => {
          if (ele && ele.selected) {
            productIndex = i;
            price = ele.price;
            bargain = ele.bargain;
            ele.prevSelected = true;
            ele.selected = false;
          } else if (ele) {
            ele.prevSelected = false;
          }
          //buyCount > 0则为开启多选商品,计算多供应商商品小计变化
          if(ele.buyCount>0){
            this.list.data.purchasingCompanyList[i].Total -= ele.price*ele.buyCount;
          }

        });
        //小计变化 小计减去当前购买数量*价格
        if (productIndex != null) {
          //未开启多选的商品
          if(!this.productList[ind].openMultiple){ //小计
              this.list.data.purchasingCompanyList[productIndex].Total -= price * buyCount;
          }
          //节省变化
          if(!this.productList[ind].openMultiple && this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
            var save = (this.productList[ind].HistoryPrice-(bargain||price))*buyCount;
            this.list.data.SelectSavePriceAll -=save;
            this.list.data.SelectPriceAll -= (bargain||price) *buyCount;

          }else if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice && this.productList[ind].openMultiple){
            this.productList[ind].sellerJson1.forEach((seller,sk)=>{
                if(seller.buyCount > 0){
                  var save = (this.productList[ind].HistoryPrice-(this.productList[ind].sellerJson1[sk].bargain||this.productList[ind].sellerJson1[sk].price))*this.productList[ind].sellerJson1[sk].buyCount;
                  this.list.data.SelectSavePriceAll -=save;
                  this.list.data.SelectPriceAll -= this.productList[ind].sellerJson1[sk].buyCount*(this.productList[ind].sellerJson1[sk].bargain||this.productList[ind].sellerJson1[sk].price);
                }
 
            })
          }
          
          //近效期数量变化
          if (this.productList[ind].sellerJson1[productIndex].overdue && !this.productList[ind].openMultiple) {
            this.list.data.CountSpxq--;
          }else if(this.productList[ind].openMultiple){
            var hasOverdue = 0;
            this.productList[ind].sellerJson1.forEach((p,k)=>{
              if(p && p.buyCount>0 && p.overdue){
                hasOverdue++;
              }
            })
            if(hasOverdue>0)  this.list.data.CountSpxq--;
          }
          //计算节省金额
          // if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
            
          // }

        }

        this.productList[ind].sellerJsonValid.forEach(function (ele,i) {
          ele.selected = false;
        })

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
        .post(this.url+"PurchasePlanSetisSelect", {
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

      for ( var i = 0, canBuy = 0, selected = 0;i < this.productList.length;i++) {
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
      var reg = /\.xl(s[xmb]?|t[xm]|am)$/;
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
          .post(this.url+"PurchasePlanImportExcelMore", data)
          .then(res => {
            if (res.data.success == true) {
              //导入成功
              //$('.uploadDoneConfirm').fadeIn();
              this.myToast("导入成功,正在刷新采购计划!");

              //导入成功,重新请求数据
              this.$http.post(this.url+"PurchaseEditRefresh", {
                id: this.id
              }).then(res => {
                if (res.data.success) {
                  this.list = res.data;
                  //console.log(this.list);
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
                this.showLoading = false;
                this.myConfirm("网络错误,请重试!");
              });

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
      e.target.value=null;
      //<input @change="upLoad($event)" type="file"/>
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
      // this.productList.forEach((ele, i) => {
      //   if (ele.sellerJson1[index]) {
      //     if (ele.sellerJson1[index].selected) {
      //       ele.isSelect = false;
      //       this.list.data.ProductCountSelect--;
      //       // this.list.data.purchasingCompanyList[index].Total=0;
      //     }
      //     ele.sellerJson1[index].selected = false;
      //     ele.sellerJson1[index].prevSelected = false;
      //     ele.sellerJson1[index].canSelect = false;
      //     //改变此商品列的canBuy值,如果所有商品都无法选择,则改为false
      //     var canSelectNum=0;
      //     ele.sellerJson1.forEach((seller,i)=>{
      //       if(seller && seller.canSelect) canSelectNum++;
      //     })
      //     if(canSelectNum==0) ele.canBuy=false;
      //   }
      // });
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
        .post(this.url+"PurchasePlanSetMatching", params)
        .then(res => {
          if (res.data.success) {
            // this.showLoading = false;
            this.getData();
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
        .post(this.url+"PurchasePlanSetMatching", params)
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
        .post(this.url+"getlist", {
          id: this.id,
          type: Number(this.showCanBuy),
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
      this.pageIndex = 1;
      this.showLoading = true;
      this.$http
        .post(this.url+"PurchaseEditRefresh", {
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
        .post(this.url+"getlist", {
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
      this.pageIndex = 1;
      this.getData();
    },
    //是否显示超库存
    changeOverStock(e) {
      this.pageIndex = 1;
      this.getData();
    },
    //是否显示近效期
    changePurchaseSpxq(e) {
      this.pageIndex = 1;
      this.getData();
    },
    //是否显示价格变化
    changePriceChange(e) {
      this.pageIndex = 1;
      this.getData();
    },
    //添加店铺匹配
    addStore() {
      
      this.pageIndex = 1;

      $('#addStore').modal('show');

      var params = new URLSearchParams();
      this.$http
        .post(this.url+"VendorAddSelectAllList",params)
        .then(res => {
          if (res.data.success) {
            //console.log(res.data.data);
            this.CompanyList = res.data.data;
            this.CompanyList.pageCount=Math.ceil(this.CompanyList.recordCount/this.CompanyList.pageSize);
            this.CompanyList.pageCountList=[];
            for(var z=0;z<this.CompanyList.pageCount;z++){
              this.CompanyList.pageCountList.push(z+1);
            }
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
    //点击页码,切换显示数据
    changePage(val){
      var params = new URLSearchParams();
      params.append('VenderName',this.VenderName);
      params.append('page',val);
      this.$http
        .post(this.url+"VendorAddSelectAllList",params)
        .then(res => {
          if (res.data.success) {
            //console.log(res.data.data);
            this.CompanyList = res.data.data;
            this.CompanyList.pageCount=Math.ceil(this.CompanyList.recordCount/this.CompanyList.pageSize);
            this.CompanyList.pageCountList=[];
            for(var z=0;z<this.CompanyList.pageCount;z++){
              this.CompanyList.pageCountList.push(z+1);
            }
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
      params.append('VenderName',this.VenderName);
      this.$http
        .post(this.url+"VendorAddSelectAllList",params)
        .then(res => {
          if (res.data.success) {
            //console.log(res.data.data);
            this.CompanyList = res.data.data;
            this.CompanyList.pageCount=Math.ceil(this.CompanyList.recordCount/this.CompanyList.pageSize);
            this.CompanyList.pageCountList=[];
            for(var z=0;z<this.CompanyList.pageCount;z++){
              this.CompanyList.pageCountList.push(z+1);
            }
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
    //模态框中添加店铺匹配
    addCompany(key) {
      this.modalCompanyChange=true;  //点击了删除或添加匹配
      this.showLoading=true;
      var params = new URLSearchParams();
      params.append("storeid", this.CompanyList.VendorList[key].venderid);
      this.CompanyList.VendorList[key].IsVendor = true;
      this.$http
        .post(this.url+"VendorAdd", params)
        .then(res => {
          if (!res.data.success) {
            //添加失败
            this.showLoading=false;
            this.CompanyList.VendorList[key].IsVendor = false;
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
              .post(this.url+"ChangePurchasePlan", params)
              .then(res => {
                this.showLoading=false;
                if (res.data.success) {
                  //this.list = res.data;
                } else {
                  if(res.data.info=="请先登录"){
                    $('.loginConfirm').fadeIn();
                  }else{
                    this.myToast(res.data.info);
                  }
                }
              })
              .catch(err => {
                this.showLoading=false;
                this.myToast("网络错误,请刷新页面重新生成采购计划!");
              });
          }
        })
        .catch(err => {
          this.showLoading=false;
          this.CompanyList.VendorList[key].IsVendor = false;
          this.myToast("网络错误,请重试!");
        });
    },
    //模态框中删除店铺匹配
    removeCompany(key) {
      this.showLoading=true;
      this.modalCompanyChange=true;  //点击了删除或添加匹配
      var params = new URLSearchParams();
      params.append("storeid", this.CompanyList.VendorList[key].venderid);
      this.CompanyList.VendorList[key].IsVendor = false;
      //console.log(this.CompanyList[key].venderid);
      this.$http
        .post(this.url+"VendorDel", params)
        .then(res => {
          if (!res.data.success) {
            this.showLoading=false;
            this.CompanyList.VendorList[key].IsVendor = true;
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
              .post(this.url+"ChangePurchasePlan", params)
              .then(res => {
                this.showLoading=false;
                if (res.data.success) {
                  //this.list = res.data;
                } else {
                  this.myToast(res.data.info);
                }
              })
              .catch(err => {
                this.showLoading=false;
                this.myToast("网络错误,请刷新页面重新生成采购计划!");
              });
          }
        })
        .catch(err => {
          this.showLoading=false;
          this.CompanyList.VendorList[key].IsVendor = true;
          this.myToast("网络错误,请重试!");
        });
    },
    //关闭匹配店铺模态框
    closeAddStore() {
      if(this.modalCompanyChange){
        this.getData();
      }
      this.modalCompanyChange=false; //恢复初始状态
      
    },
    //点击提交订单按钮
    submitOrder() {
      //console.log(this.outTopCount);
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
      //location.reload();
      $('.uploadDoneConfirm').fadeOut();
    },
    //changeIsMatchJxq 改变是否匹配近效期
    changeIsMatchJxq(e){
      //console.log(e.target.checked);
      //this.list.data.changeIsMatchJxq=!e.target.checked;
      //console.log(this.list.data.changeIsMatchJxq);
       //console.log(this.list.data.PriceEqual);
    },
    // 改变数据中是否匹配超库存的值
    changeIsMatchNotStock(e){
      //console.log(e.target.checked);
      //this.list.data.IsMatchNotStock=!e.target.checked;
      //console.log(this.list.data.PriceEqual);
       //console.log(this.list.data.IsMatchNotStock);
    },
    //鼠标移入td 显示供应商多选按钮
    mouseOn(ind){
      if(!this.productList[ind].openMultiple){
        this.productList[ind].mouseOn = true;
        this.$set(this.productList,ind,this.productList[ind]);
      }
    },
    //鼠标移出 td 
    mouseOff(ind){
      if(!this.productList[ind].openMultiple){

        this.productList[ind].mouseOn = false;
        this.$set(this.productList,ind,this.productList[ind]);
      }
    },
    //开启供应商多选,隐藏供应商多选按钮,超库存数--
    startMultiple(ind){
      var storeid = null,
          BuyCount = null,
          bargain = null,
          id = this.productList[ind].id;

      this.productList[ind].openMultiple = true;
      this.$set(this.productList,ind,this.productList[ind]);

      this.productList[ind].sellerJson1.forEach((ele,i)=>{
        if(ele.selected) {
          ele.buyCount=ele.stock;
          storeid = ele.storeid;
          BuyCount = ele.buyCount;
          bargain = ele.bargain;
          //减去之前的购买数量,加上现在的购买数量
          this.list.data.purchasingCompanyList[i].Total-=(this.productList[ind].BuyCount*ele.price);
          this.list.data.purchasingCompanyList[i].Total+=(ele.buyCount*ele.price);

          //计算多选节省金额 , 减去之前节省金额 再加上现在的节省金额
          if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
            var preSave = (this.productList[ind].HistoryPrice - (ele.bargain||ele.price))*this.productList[ind].BuyCount;
            this.list.data.SelectSavePriceAll -=preSave;
            this.list.data.SelectPriceAll -= this.productList[ind].BuyCount * (ele.bargain||ele.price);
            var save = (this.productList[ind].HistoryPrice - (ele.bargain||ele.price))*ele.buyCount;
            this.list.data.SelectSavePriceAll += save;
            this.list.data.SelectPriceAll += ele.buyCount * (ele.bargain||ele.price);
          }
          
        }
      })
      //开启多供应商选择的商品,超库存按照各个供应商来计算
      this.productList[ind].outTop1 = false;
      this.$set(this.productList,ind,this.productList[ind]);

      this.list.data.CountPurchaseSock--;

      


      //向服务器发送数据
      this.multiplePost(id,storeid,BuyCount,bargain);

    },
    //鼠标移入多选标签,显示关闭标签
    showClose(e){
      e.target.className = "opened btn btn-danger btn-xs";
      e.target.innerHTML = '关闭';
    },
    //鼠标移出关闭标签,显示多选标签
    showOpen(e){
      e.target.className = "opened btn btn-primary btn-xs";
      e.target.innerHTML = '多选';
    },
    //关闭供应商多选,显示供应商多选按钮
    closeMultiple(ind,e){
      var storeid = null,
          BuyCount = 0,
          bargain = null,
          id = this.productList[ind].id,
          selectPrice = 0;
      if(e.target.innerHTML=="关闭"){
        this.productList[ind].openMultiple = false;
        this.$set(this.productList,ind,this.productList[ind]);
        this.productList[ind].sellerJson1.forEach((ele,i)=>{
          if(ele.buyCount>0){
            this.list.data.purchasingCompanyList[i].Total-=(ele.price*ele.buyCount);

            //计算多选节省金额 , 减去之前节省金额 再加上现在的节省金额
           if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
             var preSave = (this.productList[ind].HistoryPrice - (ele.bargain||ele.price))*ele.buyCount;
              this.list.data.SelectSavePriceAll -=preSave;
              this.list.data.SelectPriceAll -= ele.buyCount * (ele.bargain||ele.price);
              
           }

          }
          if(ele.selected){
            this.list.data.purchasingCompanyList[i].Total+=(ele.price*this.productList[ind].BuyCount);
            storeid = ele.storeid;
            bargain = ele.bargain;
            selectPrice =  ele.price;
          }
      
          ele.buyCount=0;
        })

        //加上现在的节省金额
        if(this.productList[ind].HistoryPrice>0 && !this.productList[ind].wrongPrice){
              var save = (this.productList[ind].HistoryPrice - (bargain||selectPrice))*this.productList[ind].BuyCount;
              this.list.data.SelectSavePriceAll += save;
              this.list.data.SelectPriceAll += this.productList[ind].BuyCount * (bargain||selectPrice);
        }

        //关闭多选后,恢复原来的超库存(outTop0)
        if(this.productList[ind].outTop0) this.list.data.CountPurchaseSock++;
        this.productList[ind].outTop1 = this.productList[ind].outTop0;

        //向服务器发送数据,请求老接口
        var params = new URLSearchParams();
        params.append("id", this.productList[ind].id);
        params.append("BuyCount", this.productList[ind].BuyCount);
        this.$http.post(this.url+'PurchasePlanModifyBuyCount',params).then(res=>{
          // console.log(res)
        }).catch(err=>{
          this.myConfirm("网络错误,请重试!");
        })
        

      }
    },
    //多供应商选中的购买数量
    multipleCount(ind){
      var multipleCount = 0;
      this.productList[ind].sellerJson1.forEach((ele,i)=>{
        multipleCount+=ele.buyCount;
      })
      var BuyCount =  this.productList[ind].BuyCount;
      if(multipleCount>BuyCount){
        return '<a href="javascript:;" style="color:red">'+multipleCount+'<a/>';
      }else{
        return '<a href="javascript:;" >'+multipleCount+'<a/>';
      }
      
      // return multipleCount;
    },
    //开启多选后,修改购买数量
    multipleClick(){

    },
    multipleBuyCountChange(ind,key,stock,e){
      //console.log(this.productList[ind].sellerJson1[key].buyCount);
      var lastBuyCount=this.productList[ind].sellerJson1[key].buyCount;
      var nowVal = parseInt(e.target.value) || 0;

      //多供应商购买不允许购买超过此供应商的库存数数量
      var stock = this.productList[ind].sellerJson1[key].stock;
      nowVal = Math.min(nowVal,stock);
      
      this.productList[ind].sellerJson1[key].buyCount=nowVal;
      //判断修改之后是否超库存
      if(nowVal>stock){   
        if(!this.productList[ind].multipleOutTop){
           this.list.data.CountPurchaseSock++;
        }
        this.productList[ind].multipleOutTop=true;
        this.$set(this.productList,ind,this.productList[ind]);
      }else if(nowVal<=stock){
        var hasOutTop = 0;
        this.productList[ind].sellerJson1.forEach((ele,i)=>{
          if(ele.buyCount>ele.stock){
            console.log(ele.buyCount);
            hasOutTop++;
          }
        })
        if(hasOutTop==0){
          if(this.productList[ind].multipleOutTop){
            this.list.data.CountPurchaseSock--;
          }
          this.productList[ind].multipleOutTop=false;
          this.$set(this.productList,ind,this.productList[ind]);
        }
      }

      //计算小计
      var price = this.productList[ind].sellerJson1[key].price;
      if(nowVal>lastBuyCount){
          
          var ce = nowVal -lastBuyCount;
          this.list.data.purchasingCompanyList[key].Total+=(price*ce);
      }else if(nowVal<lastBuyCount){

          var ce = lastBuyCount - nowVal;
          this.list.data.purchasingCompanyList[key].Total-=(price*ce);
      }
      var storeid = this.productList[ind].sellerJson1[key].storeid,
          BuyCount = nowVal,
          bargain = this.productList[ind].sellerJson1[key].bargain,
          id = this.productList[ind].id;
      //向服务器发送数据
      this.multiplePost(id,storeid,BuyCount,bargain);

    },
    //多供应商购买请求函数
    multiplePost(id,storeid,BuyCount,bargain){
      var params = new URLSearchParams();
      params.append("id", id);
      params.append("storeid", storeid);
      params.append("BuyCount", BuyCount);
      params.append("bargain", bargain);
      this.$http.post(this.url+'PurchasePlanModifyBuyCountForMulti',params).then(res=>{
        //console.log(res.data);
      }).catch(err=>{
        this.myConfirm("网络错误,请重试!");
      })
    },
    //popover 近效期颜色
    popColor(stock,spxq,overdue){
      return `库存:${stock}<br/>效期:<span style="color:${overdue?'red':'#333'}">${spxq.slice(2)||'-'}</span>`;
    },
    showPopOver(product,item,e){
      var nextP = $(e.target).next();
      var isMain = this.list.data.PreferredSupplier>0;
      var str = '',
          percent = 0;
      product.sellerJson1.forEach((ele,i)=>{
        if(ele.storeid == this.list.data.PreferredSupplier){
          percent = (Math.abs(ele.price - item.price) / item.price *100).toFixed(2);
          str += item.price - ele.price > 0 ? '+' : '-';
          str += percent;
          str += '%';
        }
      })
      if(product.openMultiple && item.buyCount>0 && isMain){
       
        if( item.storeid != this.list.data.PreferredSupplier ){
          nextP.html(`${item.fixedSupplierTooltip}<br/>库存:${item.stock}&nbsp;&nbsp;效期:<span style="color:${item.overdue?'red':'#333'}">${item.spxq.slice(2)||'-'}</span>&nbsp;${item.Remarks}<br/>${percent>0 ? '较主供应商价格' : ''} ${str}`).show();
        }else{
          nextP.html(`库存:${item.stock}&nbsp;&nbsp;效期:<span style="color:${item.overdue?'red':'#333'}">${item.spxq.slice(2)||'-'}</span>&nbsp;${item.Remarks}`).show();
        }
        
      }else if(product.openMultiple && item.buyCount>0 && !isMain){
         
        nextP.html(`${item.fixedSupplierTooltip}<br/>库存:${item.stock}&nbsp;&nbsp;效期:<span style="color:${item.overdue?'red':'#333'}">${item.spxq.slice(2)||'-'}</span>&nbsp;${item.Remarks}`).show();
      }else if(!product.openMultiple && isMain && item.storeid != this.list.data.PreferredSupplier ){
     
        if(str.length>0 && percent>0){
          nextP.html(`${item.fixedSupplierTooltip}<br/>较主供应商价格 ${str}&nbsp;${item.Remarks}`).show();
        }else if(item.Remarks){
          nextP.html(`${item.Remarks}`).show();
        }
        
      }else if(!product.openMultiple && !isMain){
       
        if(item.fixedSupplierTooltip){
          nextP.html(`${item.fixedSupplierTooltip}&nbsp;${item.Remarks}`).show();
        }else if(item.Remarks){
          nextP.html(`${item.Remarks}`).show();
        }
      }else if(item.fixedSupplierTooltip && isMain){
   
        nextP.html(`${item.fixedSupplierTooltip}&nbsp;${item.Remarks}`).show();
      }else if(item.Remarks){

        nextP.html(`${item.Remarks}`).show();
      }

    },
    closePopOver(e){
      var nextP = $(e.target).next();
      if(nextP) nextP.hide();
    },
    toggleOpen(e){
      $(e.target).toggleClass('open');
    },
    //采购偏好中主供应商下拉框change事件
    PreferredSupplierChange(e){
      var val = $(e.target).children('option:selected').val();
      if(val <= 0){
        $("#cg_preference input[name='exception'][value='0']").prop('checked',true);
        $('#cg_preference .percent').val(0);
        $("#cg_preference input[name='exception']").prop('disabled',true);
      }else{
        $("#cg_preference input[name='exception']").prop('disabled',false);
      }
    },
    //
    startDown(ind){
      this.nowTrIndex =ind;
      //元素距离页面顶部的距离
      this.startScroll=$(`.product_container tr:eq(${ind})`).offset().top;

      //滚动过的距离
     // var hasScroll  = $(window).scrollTop();

      this.nextScrollHeight = $(`.product_container tr:eq(${ind+1})`).outerHeight() || 0;
      this.prevScrollHeight = $(`.product_container tr:eq(${ind-1})`).outerHeight() || 0;

      $('html').animate({
        scrollTop:this.startScroll-this.halfScreenHeight
      },500)
    },
    //删除当前列商品
    deleteTr(ind,id){
      $('.deleteConfirm .post').data({
        id,
        ind
      });
      $('.deleteConfirm').fadeIn();
  
    },
    //取消删除
    closeDeleteConfirm(){
      $('.deleteConfirm').fadeOut();
    },
    //确认删除
    deleteNow(){
      var $postBtn = $('.deleteConfirm .post');
      var id =  $postBtn.data('id');
      var ind = Number($postBtn.data('ind'));

      // this.productList.splice(ind,1);
      // this.closeDeleteConfirm();
      // this.myToast('删除成功');

      this.showLoading = true;
      this.$http.post(this.url+'DeletePurchaseList',{
        id
      }).then(res=>{
        if(res.data.success){
          //this.myToast('删除成功');
          this.closeDeleteConfirm();
          this.getData();
          //this.productList.splice(ind,1);
          
        }else{
          this.showLoading = false;
          this.closeDeleteConfirm();
          this.myToast(res.data.info);
        }
      }).catch(err=>{
        this.showLoading = false;
        this.closeDeleteConfirm();
        this.myToast('网络错误,请重试!');
      })

    },
    //匹配供应商优先排序
    prioritySort(storeid){
      this.showLoading = true;
      this.$http.post(this.url+'PurchasePlanSetPreference',{
        Purchase_Id:this.id,
        StoreId:storeid
      }).then(res=>{
        if(res.data.success){
          this.getData();
        }else{
          this.showLoading = false;
          this.myToast(res.data.info);
        }
      }).catch(err=>{
        this.showLoading=false;
        this.myToast('网络错误,请重试!');
      })
    },
    trChangeIndex(ind){
      this.nowTrIndex = ind;
    },
    midChange(ind,e){
      var count = this.productList[ind].BuyCount;
      var mid = this.productList[ind].Goods_Pcs_Small;
      var single = count%mid;
      var ce = 0;
      if(single>0){
         ce = mid - (single);
      }
     
      count+=ce;
      this.productList[ind].BuyCount = count;
      // console.log(count);
      $(e.target).parent().find('input').val(count);



      var prevBuyCount=this.productList[ind].BuyCount0;
      var val = count;
      // console.log(val);
      if (isNaN(val) || val <= 0) {
        val = 1;
        //this.productList[ind].isSelect=false;
      }
      this.productList[ind].BuyCount = val;
      this.$set(this.productList,ind,this.productList[ind]);

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
          //计算节省金额
          if(this.productList[ind].HistoryPrice>0){
            //当修改后的购买数量大于之前的购买数量
            if(val>prevBuyCount){
              var save= (val-prevBuyCount)*(this.productList[ind].HistoryPrice - price);
              this.list.data.SelectSavePriceAll +=save;
              this.list.data.SelectPriceAll += (val-prevBuyCount)*price;
            }else if(val<prevBuyCount){
              var save= (prevBuyCount - val) * (this.productList[ind].HistoryPrice - price);
              this.list.data.SelectSavePriceAll -= save;
              this.list.data.SelectPriceAll -= (prevBuyCount - val)*price;
            }
          
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
        .post(this.url+"PurchasePlanModifyBuyCount", {
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
    closeOffline(){
      this.offlineModalData = [];
      $('.offlineModal').hide();
    },
    getOfflineTotal(store_Id){
      var str = "¥";
      for(var i = 0; i<this.list.data.purchasingCompanyListAll.length; i++){
        if(this.list.data.purchasingCompanyList[i] && this.list.data.purchasingCompanyList[i].storeid == store_Id){
          str += this.list.data.purchasingCompanyList[i].Total.toFixed(2);
          break;
        }else if(this.list.data.purchasingCompanyListAll[i].storeid == store_Id){
          str += this.list.data.purchasingCompanyListAll[i].Total.toFixed(2);
          break;
        }
      }
      return str;

    },
    getIsOffline(store_Id){
      for(var i = 0; i<this.list.data.purchasingCompanyListAll.length; i++){
        if(this.list.data.purchasingCompanyListAll[i].storeid == store_Id){
          return this.list.data.purchasingCompanyListAll[i].isOnline;
        }
      }

    },
    getOfflineDate(date){
      if (date.length>2) {
        date = new Date(Date.parse((date).replace(/-/g,'/')));
        date = date.toLocaleDateString();
        var dayIndex=date.indexOf('日');
        if(dayIndex!=-1){
          date=date.replace(/[\u4e00-\u9fa5]/g,'/').slice(0,dayIndex);
        }
      } else {
        date = "-";
      }
      if(date=="Invalid Date"){
        date="-";
      }

      return date;

    },
    //线下模态框供应商选择提交
    offlinePost(){

      this.offlineModalData = [];
      $('.offlineModal').hide();
    },
    offlineSelect(storeid){
      var selectedStoreid = null;
      var index = Number($('.offlineModal .post').data('index')),  //productList 下标
          key   = Number($('.offlineModal .post').data('key')),    //purchasingCompanyList 下标
          prevStoreid = null,
          prevPrice = 0,
          bargain = 0,
          remarks = "";

      var buyCount = this.productList[index].BuyCount,
          price = 0,
          companyName = "",
          chooseKey = null;

       this.offlineModalData.forEach((item,ind)=>{
        if(item.selected){
          prevStoreid = item.storeid;
          prevPrice = item.price;
        }
         item.selected = false;
         if(item.storeid == storeid){

           item.selected = true;
           selectedStoreid = item.storeid;
           price = item.price;
           companyName =  item.CompanyName;
           bargain = item.bargain;
           remarks = item.Remarks;

         }
       })

       //减去上次选中线下
      if(prevStoreid != null){
        this.list.data.purchasingCompanyListAll.forEach((item,ind)=>{
          if(item.storeid == prevStoreid){
            item.Total -= (buyCount*prevPrice);
          } 
        })
      }

       this.list.data.purchasingCompanyList.forEach((ele,i)=>{
         if(selectedStoreid == ele.storeid){
           chooseKey = i;
         }
       })

      if(selectedStoreid<0){             //店铺id小于0,线下店铺
        
        for(var i =0;i<this.productList[index].sellerJson1.length;i++){
          var item = this.productList[index].sellerJson1[i];
          if( item && item.selected){     //减去之前选中的商品
            //计算近效期
            if (item.overdue && item.storeid>0) {       
              //之前选中的商品是近效期
               this.list.data.CountSpxq--;       
            } else if(!item.overdue && item.storeid>0) {
              this.list.data.CountSpxq++;
            }

            // 计算节省金额 (减去之前的节约金额)
            if(this.productList[index].HistoryPrice>0 && !this.productList[index].wrongPrice){
              var preSave= buyCount*(this.productList[index].HistoryPrice - (item.bargain || item.price));
              this.list.data.SelectSavePriceAll -=preSave;
              this.list.data.SelectPriceAll -= buyCount * (item.bargain || item.price);
            }

            //异常价格
           if(price >= this.productList[index].HistoryPrice * 2 || this.productList[index].HistoryPrice >= price*2){
             this.productList[index].wrongPrice = true;
           }else{
             this.productList[index].wrongPrice = false;
           }
             
            

            this.list.data.purchasingCompanyList[i].Total -= (item.price * buyCount);
            item.selected = false;

          }
          if(item && item.storeid == 0){  
            
            if(!item.selected){  //之前线下未选中
              
              this.list.data.purchasingCompanyList[key].Total += (price * buyCount);
              this.list.data.purchasingCompanyListAll.forEach((ele,i)=>{
                if(ele.storeid == selectedStoreid){
                  ele.Total += (price * buyCount);
                }
              })
 
              item.selected =true;
            }else{               //之前线下已选中
              this.list.data.purchasingCompanyList[key].Total -= (this.productList[index].sellerJson1[key].price * buyCount);
              this.list.data.purchasingCompanyList[key].Total += (price * buyCount);
            }
            item.price = price;
            item.CompanyName = companyName;
            item.Remarks = remarks;
            
            
          }

        }

        //超库存
        if(this.productList[index].outTop1){
          this.list.data.CountPurchaseSock--;
          this.productList[index].outTop1 = false;
        }

        //加上现在的节约金额
        if(this.productList[index].HistoryPrice>0 && !this.productList[index].wrongPrice){
            //console.log('加上现在的节约金额');
            var nowSave = this.productList[index].BuyCount*(this.productList[index].HistoryPrice - (bargain || price));
            this.list.data.SelectSavePriceAll +=nowSave;
            this.list.data.SelectPriceAll += this.productList[index].BuyCount * (bargain||price);

        }

        //向服务器发送数据选中的商品
        this.$http.post(this.url+"PurchasePlanChangeStoreid", {
            id: this.productList[index].id,
            storeid: storeid,
            bargain: 0
          }).then(res => {
            if(!res.data.success){
              if(res.data.info=="请先登录"){
                $('.loginConfirm').fadeIn();
              }else{
                this.myToast(res.data.info);
              }
            }
          }).catch(err => {
            //console.log(err);
            this.myConfirm("网络错误,请重试!");
          });
        //向服务器发送此商品勾选
        var obj = {},
            str = "";
        obj[this.productList[index].id] = true;
        for (var a in obj) {
          str += a + ":";
          str += obj[a];
        }
        var params = new URLSearchParams();
        params.append("data", str);
        this.$http
          .post(this.url+"PurchasePlanSetisSelect", params)
          .then(res => {
            if (!res.data.success) {
              this.myConfirm(res.data.info);
            }
          })
          .catch(err => {
            this.myToast("网络错误,请重试!");
          });



      }else if(selectedStoreid>0){     //店铺id大于0,线上店铺

        this.productList[index].sellerJson1[chooseKey].selected?'':this.product_choose(index, chooseKey, buyCount, price);
        

      }


    },
    //切换是否分页
    IsPage(e){
      var isPage = $(e.target).val();
      var params = new URLSearchParams();
      params.append('IsPage',isPage);
      params.append('PurchaseId',this.id);
      this.$http.post(this.url+'PurchasePerferenceSettIsPage',params)
          .then(res=>{
            if(!res.data.success){
              this.myConfirm(res.data.info);
            }else{
              this.nowTrIndex = 0;
              this.getData();
            }
          }).catch(err=>{
            this.myToast('网路错误,请重试!')
          })


    },
    pageSizeChange(e){

      var pageSize = $(e.target).val();
      this.pageSize = Number(pageSize);
      this.pageIndex = 1;
      this.nowTrIndex = 0;
      this.getData();
    },
    pageIndexChange(num){
      this.pageIndex = num;
      this.nowTrIndex = 0;

      $('html:not(:animated),body').animate({
        scrollTop:0
      },300)

      this.getData();
    },
    pageIndexAdd(){
      if(this.pageIndex<this.list.data.PageCount){
        this.pageIndex++;
        this.nowTrIndex = 0;
        $('html:not(:animated),body').animate({
          scrollTop:0
        },300)
        this.getData();
      }
      
    },
    pageIndexReduce(){
      if(this.pageIndex>1){
        this.pageIndex--;
        this.nowTrIndex = 0;
        $('html:not(:animated),body').animate({
          scrollTop:0
        },300)
        this.getData();
      }
      
    },
    //页码显示
    showNum(num){
      num = Number(num);
      if(num == 1){
        return num;
      }else if(num == this.list.data.PageCount){
        return num;
      }else if(num+3 == this.list.data.PageIndex){
        return "..."
      }else if(this.list.data.PageIndex+3==num){
         return "..."
      }else {
        return num;
      }
    },
    //点击复制ERP编号
    copyPSN(val){
      var Input = document.createElement('input');
      Input.value = val;
      document.body.appendChild(Input);
      Input.select();
      document.execCommand('Copy');
      document.body.removeChild(Input);
      this.myToast('ERP编号复制成功!');
    },
    preferenceBtn(){
      this.showCGPH=true;
      $('#cg_preference').modal('show');
    },
    //关闭自定义表头
    closeCustom(){
      this.showCustomModal = false;
    },
    //自定义按钮
    customBtn(){
      this.showCustomModal = true;
    },
    //自定义表头设置模态框中选择去全部字段
    checkCustomAll(e){
      // var hasChecked = 0;
      $('.customModal .inner input').each((i,ele)=>{
        if(e.target.checked){
          $(ele).prop('checked',true);
          // hasChecked++;
        }else{
          $(ele).prop('checked',false);
        } 
      })
      // this.customCheckedCount = hasChecked;

    },
    //自定义表头模态框确定
    confirmCustom(){
      //自定义字段
      $('.customModal .inner .customTable input').each((i,ele)=>{
        var $input = $(ele);
        this.list.data.ExceptionField[i].show  = localStorage[this.id + $input.val()] = $input.prop('checked');
      })

      //参考字段
      localStorage[ this.id + 'showStock'] = this.showStock =  Number($('.customModal .inner .referTableContent input:eq(0)').prop('checked'));
      localStorage[ this.id + 'showMonthlySales'] = this.showMonthlySales =  Number($('.customModal .inner .referTableContent input:eq(1)').prop('checked'));
      localStorage[ this.id + 'showPrice'] = this.showPrice = Number($('.customModal .inner .referTableContent input:eq(2)').prop('checked'));

      var hasChecked = 0;
      $('.customModal .inner input').each((i,ele)=>{
        if( $(ele).prop('checked') ){
          hasChecked++;
        }
      })
      this.customCheckedCount = hasChecked;

      this.showCustomModal = false;

    }


  },
  watch: {
    //仅显示可采checkbox切换
    list(nVal) {
      this.productList = nVal.data.productList;

      //修改自定义表头数据
      this.customCheckedCount = 0;
      if(nVal.data.ExceptionField){
        var arr = nVal.data.ExceptionField.slice(0);
        nVal.data.ExceptionField = [];
        for(var customItem of arr){
          var obj = {};
          obj.customName =customItem;
          obj.show = true;      //默认显示,如果H5本地存储中保存有值,则替换为本地值
          // localStorage[this.id+customItem] == undefined ? '' : ( localStorage[this.id+customItem]==='true'? obj.show=true: obj.show=false );
          
          if(localStorage[this.id+customItem] == undefined){
            localStorage[this.id+customItem] = true;
          }
          if(localStorage[this.id+customItem] != undefined){

            if(localStorage[this.id+customItem]==='true'){
              obj.show=true;
              this.customCheckedCount++;
            }else if(localStorage[this.id+customItem]==='false'){
              obj.show=false;
            }

          }

          nVal.data.ExceptionField.push(obj);
        }
      }
      
      //最大值和最小值
      this.productList.forEach((ele,index)=>{
        ele.maxPrice=(Math.max.apply(Math, ele.sellerJson1.map(function(o) {return o.price})));
        ele.minPrice=(Math.min.apply(Math, ele.sellerJson1.map(function(o) {return o.price})));
        if(ele.Stock>0) this.showStock=1;
        if(ele.showMonthlySales>0) this.showMonthlySales=1;
        if(ele.HistoryPrice>0) this.showPrice=1;
        
        if( ele.HistoryPrice>0 && (ele.HistoryPrice*2<=ele.Price || ele.HistoryPrice >= 2*ele.Price) ){
          ele.wrongPrice = true;
        } else{
          ele.wrongPrice = false;
        }

      })

      //读取本地是否显示库存信息
      if(localStorage[ this.id + 'showStock'] != undefined){
        this.showStock = Number(localStorage[ this.id + 'showStock']);
      }
      if(localStorage[ this.id + 'showMonthlySales'] != undefined){
        this.showMonthlySales = Number(localStorage[ this.id + 'showMonthlySales']);
      }
      if(localStorage[ this.id + 'showPrice'] != undefined){
        this.showPrice = Number(localStorage[ this.id + 'showPrice']);
      }

      this.showStock>0?this.customCheckedCount++:'';
      this.showMonthlySales>0?this.customCheckedCount++:'';
      this.showPrice>0?this.customCheckedCount++:'';


      //重新计算productList,使其sellerJson1数组长度等于商家个数
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
              // canBuy++;
              var productId = ele.sellerJson1[j].storeid;
              var product_spxq = new Date(Date.parse((ele.sellerJson1[j].spxq).replace(/-/g,'/'))); //计算近效期
              if (ele.sellerJson1[j].spxq) {
                //2018/9/6使用后端返回的isJxq来判断是否是近效期
                //ele.sellerJson1[j].overdue = product_spxq - time > 0 ? false : true;
                ele.sellerJson1[j].overdue =  ele.sellerJson1[j].isJxq > 0 ? true : false;
                ele.sellerJson1[j].spxq = product_spxq.toLocaleDateString();
                var dayIndex=ele.sellerJson1[j].spxq.indexOf('日');
                if(dayIndex!=-1){
                  ele.sellerJson1[j].spxq=ele.sellerJson1[j].spxq.replace(/[\u4e00-\u9fa5]/g,'/').slice(0,dayIndex);
                }
              } else {
                ele.sellerJson1[j].spxq="";
                ele.sellerJson1[j].overdue = false;
              }
              if(ele.sellerJson1[j].spxq=="Invalid Date"){
                ele.sellerJson1[j].spxq="";
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
              output[i].ismidpacking = this.list.data.purchasingCompanyList[i].ismidpacking;
              if(output[i].selected){
                ele.Goods_Pcs_Small =output[i].ismidpacking ? output[i].Goods_Pcs_Small : 1;
              }
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
          // ele.canBuy = canBuy > 0 ? true : false;
        }
        if (hasSelect == 0) ele.isSelect = false;
        ele.sellerJson1 = output;
        //判断canbuy
        for(var k=0,canBuy=0,multiple=0;k<ele.sellerJson1.length;k++){
          if(ele.sellerJson1[k]!=undefined && this.list.data.purchasingCompanyList[k].Enabled && ele.sellerJson1[k].storeid != 0) canBuy++;
          if(ele.sellerJson1[k]!=undefined && ele.sellerJson1[k].storeid == 0) canBuy += ele.sellerJson1[k].OfflineSupplierCount;
          if(ele.sellerJson1[k]!=undefined && ele.sellerJson1[k].buyCount>0) multiple++;
        }
        ele.canBuy = canBuy > 0 ? true : false;
        ele.openMultiple = multiple>0 ? true : false;//是否已经开启多供应商
        //ele.BuyCountMultiple = ele.BuyCount;
        
        //能否开启供应商多选,商品不为多店状态,且供应商大于1
        if(ele.BranchesCount==0 && canBuy>1){
          ele.canMultiple = true;
        }else{
          ele.canMultiple = false;
        }
        ele.mouseOn = false;      //鼠标移入td
        

      });
      
      // console.log(this.productList);
    },
    offlineModalData(nVal){
      if(nVal.length>0){
        $('.offlineModal').show();
      }
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
    },
    //计算节省金额
    saveMoney(){

      var SelectSavePriceAll = this.list.data.SelectSavePriceAll ;
      var percent=(SelectSavePriceAll.toFixed(2)/this.list.data.SelectPriceAll.toFixed(2))*100||0;
      return SelectSavePriceAll.toFixed(2)+'  ， '+percent.toFixed(2)+'%';  

    },
    //计算超库存数量   无法使用,筛选过后不能只显示当前筛选的商品的超库存数量
    outTopCount(){
      var count=0;
      this.productList.forEach((ele,i)=>{
        ((ele.outTop1 && !ele.openMultiple)||(ele.openMultiple && ele.multipleOutTop && ele.isSelect) )?count++:'';
    
      })
      return count;
    },
    //采购偏好设置中的高级选项下拉选择
    filterCompanyName(){
      return this.list.data.purchasingCompanyList.filter((item)=>{
        return item.storeid>0;
      })
    },
    //自定义表头模态框已选字段数量


  }
};
</script>

<style lang="less">
@media (min-width: 992px) {
  .modal-big,
  .container{
    width: 100%;
  }
}
@media (min-width: 1200px) {
  .modal-big,
  .container{
    width: 100%;
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
      .manage{
        >ul{
          >li{
            >a{
              color:#777;
            }
          }
        }

        &:hover .dropdown-menu{
        display: block;
      }

      }

    }
  }
  a{
    color:#fff;
    &:hover{
      background-color:rgba(0, 0, 0, 0.1) !important;
    }
    &:focus{
      background-color:rgba(0, 0, 0, 0.1) !important;
    }
  }
  .nav .open>a{
    background-color: rgba(0,0,0,0.1) !important;

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
    padding-bottom:80px;
    margin-bottom: 60px;
    &.helpFixed{
      padding-top:70px;
    }
    > .box_header {
      padding: 10px 0;
      > .check {
        > p {
          display: inline-block;
          margin-right:6px;
          >label{
            font-weight: normal;
            cursor: pointer;
          }
          > span {
            padding: 0 6px;
            background-color: #d2d6de;
            border-radius: 3px;
          }
        }
      }
      > .shortcut {
        i{
          font-style: normal;
          font-size: 12px;
        }
        >.fa-pencil-square-o{
          position:relative;
          >span{
            position: absolute;
            top:-10px;
            right:-4px;
            background-color: #f39c12 !important;
          }
        }
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
        
        >.fa-plus{
           position:relative;
          >span{
            position: absolute;
            top:-10px;
            right:-4px;
            background-color: #00C1F4 !important;
          }
        }
      }
      >.pageTurn{
        height:60px;
        padding:10px;
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
          height:56px;
          &.oldChrome{
            position: relative !important;
            left:0 !important;
          }
        }
        th:first-child {
          width: 40px;
          position: sticky;
          left: 0;
          background-color: #fff;
          z-index: 99;
        }
        th:nth-child(2) {
          position: sticky;
          left: 39px;
          background-color: #fff;
          z-index: 99;
          &.fixWidth{
            width:260px;
          }
        }
        th:nth-child(3) {
          padding:0;
          width: 150px;
          position:sticky;
          z-index: 99;
          background-color:#fff;
          left:298px;
          &.one{
            width:50px;
            >ul{
              >li{
                width:100%;
              }
            }
          }
          &.two{
            width:100px;
            >ul{
              >li{
                width:50%;
              }
            }
          }
          &.none{
            width:50px;
            >ul{
              >li{
                width:100%;
              }
            }
          }
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
          position:sticky;
          z-index: 99;
          background-color:#fff;
          &.fixed{
              box-shadow: 6px 0px 10px rgba(0,0,0,.35);
          }
        }
        th.td_supplier {
          padding-bottom: 0;
          padding: 0;
          width:92px;
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
          >span{
            position: absolute;
            right: 0;
            top: 0;
            border: 10px solid #ee1d24;
            border-left-color: transparent;
            border-bottom-color: transparent;
          }
        }
        th.custom{
          width:92px;
        }
      }
      > .product_container {
        table-layout: fixed;
        margin-top: 20px;
        background-color:#fff;
        tr {
          text-align: center;
          &.oldChrome{
              >td:nth-child(-n+6){
                position: relative !important;
                left:0 !important;
              }
              
          }
          &.nowTrIndex{
            background-color: #f5f5f5;
          }
          &.multiple{
            background-color:#FCF8E3;
          }
          &.no_product {
            cursor: not-allowed;
            input {
              cursor: not-allowed;
            }
          }
          > td {
            vertical-align: middle;
            &.multiple{
              background-color:#FCF8E3 !important;
            }
            &.nowTrIndex{
              background-color: #f5f5f5;
            }
            &:first-child {
              width: 40px;
              position: sticky;
              left: 0;
              background-color: #fff;
              z-index: 99;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
              >input{
                cursor:pointer;
              }
              >.fa-window-close{
                color: #ddd;
                position: absolute;
                right: 0;
                top: 2px;
                cursor: pointer;
                &:hover{
                  color:rgb(214, 48, 48);
                }
              }
              >p{
                margin:0;
                color:#999;
              }
            }
            &:nth-child(2) {
              &.fixWidth{
                width:260px;
              }

              overflow: hidden;
               position: sticky;
              left: 39px;
              background-color: #fff;
              z-index: 99;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
              >.nowTrIndex{
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 6px;
                background-color: rgba(236, 28, 38, 0.5);
              }
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
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                
              }
              >.lastTransaction{
                  color:#fff;
                  background-color: #999;
                  padding:0 4px;
                  position: absolute;
                  right:0;
                  bottom:0;
                  background-color: rgba(0, 0, 0, 0.1);
                  font-size: 12px;
              }
              >.psn{
                  color:#fff;
                  background-color: #999;
                  padding:0 4px;
                  position: absolute;
                  left:0;
                  bottom:0;
                  background-color: rgba(0, 0, 0, 0.1);
                  font-size: 12px;
                  cursor: pointer;
              }
              
            }
            &:nth-child(3) {
              width: 50px;
              position:sticky;
              left:300px;
              z-index: 99;
              background-color:#fff;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
            }
            &:nth-child(4) {
              width: 50px;
              position:sticky;
              z-index: 99;
              background-color:#fff;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
            }
            &:nth-child(5) {
              width: 50px;
              position:sticky;
              z-index: 99;
              background-color:#fff;
              padding-left:4px;
              padding-right:4px;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
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
              position: sticky;
              z-index: 99;
              background-color:#fff;
              &.nowTrIndex{
                background-color: #f5f5f5;
              }
              &.fixed{
                box-shadow: 6px 0px 10px rgba(0,0,0,.35);
              }
               input {
                background-color: #fff;
                text-align: center;
                &.out_top {
                  color: red !important;
                  border-color: red !important;
                }
                &.mid{
                  color:#F39C12;
                  border-color:#F39C12;
                }
              }
              button.open{
                // position:absolute;
                // bottom:0;
                // left:10px;
                border-radius: 0;
                z-index: 666;
              }
              >button.opened,>button.stop{
                position:absolute;
                top:0;
                right:0;
                border-radius: 0;
              }
              // &:hover .open{
              //   display: block;
              // }
            }
            &.custom{
              width:92px;
            }
            &.td_supplier {
              position: relative;
              padding: 0;
              width:92px;
              input.out_top{
                color: red;
                border-color: red
              }
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
                padding-left:0;
                >b{
                  position: absolute;
                  left:0;
                  top:0;
                  border:10px solid #5bc0de;
                  border-right-color: transparent;
                  border-bottom-color: transparent;
                }
                > p {
                  padding-right: 6px;
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
                .max{
                  color:red;
                }
                .min{
                  color:#5cb85c;
                }
                .fixCircle{
                  display: inline-block;
                  width:6px;
                  height:6px;
                  border-radius: 50%;
                  margin-right:8px;
                  margin-bottom:2px;
                }
                .info {
                  > p {
                    color: #999;
                    font-size: 12px;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
              >p{
                width: 210px;
                position: absolute;
                bottom: -90px;
                z-index: 200;
                left: -90px;
                line-height: 20px;
                height: 80px;
                background-color: #fff;
                border: 1px solid #ddd;
                padding-top:10px;
                text-align: center;
                border-radius: 8px;
                &:after{
                  content:'';
                  display: inline-block;
                  position:absolute;
                  top:-10px;
                  left:100px;
                  width:20px;
                  height: 20px;
                  border:1px solid #ddd;
                  border-right-color: #fff;
                  border-bottom-color: #fff;
                  background-color: #fff;
                  transform: rotate(45deg);
                }
              }
              >span{
                position: absolute;
                bottom: 0;
                left: 0;
                font-size: 12px;
                color: red;
                padding:2px;
                background-color: rgba(0,0,0,0.2);
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
  z-index:200;
  > .account_inner {
    @media screen and(min-width:1520px) {
      width: 1500px;
    }
    @media screen and(min-width:1200px) and (max-width: 1519px) {
      width: 1120px;
    }
    @media screen and(max-width:1200px) and(min-width:768px) {
      width: 100%;
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
      font-size: 14px;
      padding-left: 12px;
      > span {
        color: #f07540;
        font-size: 16px;
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
    border-radius: 10px;
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
.offlineModal {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  > .offlineBody {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 940px;
    height: 420px;
    background-color: #fff;
    border-radius: 10px;
    > .title {
      padding: 15px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      > .rf {
        cursor: pointer;
      }
    }
    > .offlineContent {
      border-bottom: 1px solid #ddd;
      height:320px;
      overflow: auto;
      >ul{
        padding:10px;
        &:after{
          display: block;
          content:'';
          clear: both;
        }
        >li{
          float:left;
          width:100px;
          height:100px;
          border:1px solid #ddd;
          text-align: right;
          margin-bottom:20px;
          >p{
            margin: 0;
            white-space: nowrap;  
            text-overflow:ellipsis; 
            overflow:hidden;
            height:18px;
            line-height: 18x;
            &.companyName{
              color:#999;
              font-size:12px;
            }
            &.total{
              background-color:rgb(252, 248, 227);
              font-size:12px;
            }
            &.online{
              background-color:rgb(218, 237, 247) !important;
            }
          }
          >.info{
            height:64px;
            padding-right:14px;
            color:#999;
            position: relative;
            cursor: pointer;
            &.selected{
              background-color:#dff0d8;
            }
            >p{
              margin:0;
              white-space: nowrap;  
              text-overflow:ellipsis; 
              overflow:hidden;
              &.price{
                font-size: 16px;
                color:#000;
              }
              &.stock{
                font-size: 12px;
              }
              &.spxq{
                font-size: 12px;
              }
            }
            >.icon{
              position:absolute;
              top:0;
              right:0;
              border:10px solid #5cb85c;
              border-left-color:transparent;
              border-bottom-color:transparent;
              color:#fff;
              >span{
                position:absolute;
                top:-12px;
                right: -10px;
              }
            }
          }
        }
      }
    }
    > .offlineFooter {
      position:absolute;
      bottom:0;
      width:100%;
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
    border-radius: 10px;
    > .title {
      padding: 15px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      > .rf {
        cursor: pointer;
      }
    }
    > .branchesContent {
      height:210px;
      padding: 15px;
       p {
        height: 40px;
        line-height: 40px;
        > .left {
          text-align: right;
          color: #333;
          font-weight: bold;
        }
        .fa-minus-circle{
          color:red;
          cursor: pointer;
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
  z-index: 1100;
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
  >.modal-dialog{
    width:1000px !important;
  }
  table {
    td,
    th {
      text-align: center;
      vertical-align: middle;
    }
  }
}
.orderConfirm,
.deleteConfirm,
.changeConfirm,
.loginConfirm,
.uploadDoneConfirm,
.refreshConfirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1800;
  background-color: rgba(0, 0, 0, 0.35);
  > .content {
    position: absolute;
    width: 400px;
    height: 152px;
    padding: 10px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    border-radius: 10px;
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
  width: 256px;
  height: 80px;
  padding:12px;
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
#cg_preference{
  .toggleBtn{
    &.open{
      >.caret{
        border-bottom:4px dashed;
        border-top:none !important;
      }
    }
  }
}
.customModal {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  > .customBody {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 650px;
    height: 366px;
    background-color: #fff;
    border-radius: 10px;
    > .title {
      padding: 15px;
      margin: 0;
      border-bottom: 1px solid #ddd;
      > .rf {
        cursor: pointer;
      }
    }
    > .customContent {
      overflow-y: auto;
      height:256px;
      padding:14px;
      border-bottom:1px solid #ddd;
      >.inner{
        height:200px;
        border:1px solid #ddd;
        padding:14px;
        label{
          margin-right:20px;
          font-weight: normal;
        }
        .titleLine{
          border-bottom:1px solid #ddd;
          color:#999;
        }
        >.customTable{
          margin-bottom:16px;
        }


      }

    }
    > .customFooter {
      padding: 0 15px;
      text-align: right;
      height: 60px;
      line-height: 60px;
    }
  }
}
</style>