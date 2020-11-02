(function () {
    // 上传地址
    const UploadHost = '/admin/upload_file';



    function SKU(warp) {
        this.warp = $(warp);
        this.attrs = {};
        this.commonPrice = 0; // 统一价格
        // 增加字段
        this.commonSkuId = '';
        this.commonGoodsNo = '';
        this.commonSkuNo = '';
        this.commonMakeCharges = '';
        this.commonMaterialType = '999';
        this.commonGoodsDeposit = '';
        this.commonCommission = '';
        this.commonStock = ''; // 统一库存
        this.commonWeight = ''; // 统一重量
        this.init();
    }

    SKU.prototype.init = function () {
        let _this = this;

        // 选择sku的类型（单规格/多规格）
        _this.warp.find('.sku_four_attr_select .btn').click(function () {
            let _dom = $(this);
            if (!_dom.hasClass('btn-success')) {
                _dom.addClass('btn-success').removeClass('btn-default')
                        .siblings().removeClass('btn-success').addClass('btn-default');

                if (_dom.hasClass('Js_single_btn')) {
                    // 点击了单规格
                    // 隐藏多规格编辑DOM
                    _this.warp.find('.sku_four_attr_key_val,.sku_four_edit_warp').hide();
                } else if (_dom.hasClass('Js_many_btn')) {
                    // 点击了多规格
                    // 显示多规格编辑DOM
                    _this.warp.find('.sku_four_attr_key_val,.sku_four_edit_warp').show();
                }
            }
            _this.processSku()
        });

        // 绑定属性值添加事件
        _this.warp.find('.sku_four_attr_key_val').on('click', '.Js_add_attr_val', function () {
            let html = '<div class="sku_attr_val_item">' +
                    '<div class="sku_attr_val_input">' +
                    '<input type="text" class="form-control">' +
                    '</div>' +
                    '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                    '</div>';
            $(this).before(html);
        });

        // 绑定属性值移除事件
        _this.warp.find('.sku_four_attr_key_val').on('click', '.Js_remove_attr_val', function () {
            $(this).parent('.sku_attr_val_item').remove();
            _this.getSkuAttr();
        });

        // 绑定添加属性名事件
        _this.warp.find('.Js_add_attr_name').click(function () {
            let html = '<tr>' +
                    '<td><input type="text" class="form-control"></td>' +
                    '<td>' +
                    '<div class="sku_attr_val_warp">' +
                    '<div class="sku_attr_val_item">' +
                    '<div class="sku_attr_val_input">' +
                    '<input type="text" class="form-control">' +
                    '</div>' +
                    '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                    '</div>' +
                    '<div class="sku_attr_val_item Js_add_attr_val" style="padding-left:10px">' +
                    '<span class="btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td>' +
                    '<span class="btn btn-danger Js_remove_attr_name">移除</span>' +
                    '</td>' +
                    '</tr>';
            _this.warp.find('.sku_four_attr_key_val tbody').append(html)
        });

        // 绑定移除属性名事件
        _this.warp.find('.sku_four_attr_key_val').on('click', '.Js_remove_attr_name', function () {
            console.log('移除属性名');
            $(this).parents('tr').remove();
            _this.getSkuAttr()
        });

        // 绑定input变化事件
        _this.warp.find('.sku_four_attr_key_val tbody').on('change', 'input', _this.getSkuAttr.bind(_this));
        _this.warp.find('.sku_four_edit_warp tbody').on('keyup', 'input', _this.processSku.bind(_this));

        // 统一库存
        _this.warp.find('.sku_four_edit_warp thead').on('keyup', 'input.Js_stock', function () {
            _this.commonStock = $(this).val();
            _this.warp.find('.sku_four_edit_warp tbody td[data-field="stock"] input').val(_this.commonStock);
            _this.processSku()
        });

        // 统一价格
        _this.warp.find('.sku_four_edit_warp thead').on('keyup', 'input.Js_price', function () {
            _this.commonPrice = $(this).val();
            _this.warp.find('.sku_four_edit_warp tbody td[data-field="price"] input').val(_this.commonPrice);
            _this.processSku()
        });

        // 统一定金
        _this.warp.find('.sku_four_edit_warp thead').on('keyup', 'input.Js_deposit', function () {
            _this.commonGoodsDeposit = $(this).val();
            _this.warp.find('.sku_four_edit_warp tbody td[data-field="goods_deposit"] input').val(_this.commonGoodsDeposit);
            _this.processSku()
        });

        // SKU图片上传
        _this.warp.find('.sku_four_edit_warp tbody').on('click', '.Js_sku_upload', function () {
            _this.upload($(this))
        });

        // 清空SKU图片
        _this.warp.find('.sku_four_edit_warp tbody').on('click', '.Js_sku_del_pic', function () {
            let td = $(this).parent();
            td.find('input').val('');
            td.find('.Js_sku_upload').css('background-image', 'none');
            _this.processSku()
        });

        let old_val = _this.warp.find('.Js_four_sku_input').val();
        if (old_val) {
            // 根据值生成DOM
            old_val = JSON.parse(old_val);
            if (old_val.type === 'many') {
                // 多规格
                _this.warp.find('.sku_four_attr_select .Js_many_btn').trigger('click');

                // 处理规格名
                let attr_names = old_val.attrs;
                let tbody = _this.warp.find('.sku_four_attr_key_val tbody');
                let attr_keys = Object.keys(attr_names);
                let attr_keys_len = attr_keys.length;
                attr_keys.forEach(function (attr_key, index) {
                    // 规格名
                    let tr = tbody.find('tr').eq(index);
                    tr.find('td:eq(0) input').val(attr_key);

                    // 规格值
                    let attr_val_td = tr.find('td:eq(1)');
                    let attr_vals = attr_names[attr_key];
                    let attr_vals_len = attr_vals.length;
                    attr_vals.forEach(function (attr_val, index_2) {
                        attr_val_td.find('input').eq(index_2).val(attr_val);
                        if (index_2 < attr_vals_len - 1) {
                            attr_val_td.find('.Js_add_attr_val').trigger('click');
                        }
                    });

                    // 接着处理下一行
                    if (index < attr_keys_len - 1) {
                        tr.find('td:eq(2) .Js_add_attr_name').trigger('click');
                    }
                });

                // 生成具体的SKU配置表单
                _this.attrs = old_val.attrs;
                _this.SKUForm(old_val.sku);
            }
        } else {
            _this.processSku()
        }
    };

    // 获取SKU属性
    SKU.prototype.getSkuAttr = function () {
        let attr = {}; // 所有属性
        let _this = this;
        let trs = _this.warp.find('.sku_four_attr_key_val tbody tr');
        trs.each(function () {
            let tr = $(this);
            let attr_name = tr.find('td:eq(0) input').val(); // 属性名
            let attr_val = []; // 属性值
            if (attr_name) {
                // 获取对应的属性值
                tr.find('td:eq(1) input').each(function () {
                    let ipt_val = $(this).val();
                    if (ipt_val) {
                        attr_val.push(ipt_val)
                    }
                });
            }
            if (attr_val.length) {
                attr[attr_name] = attr_val;
            }
        });

        if (JSON.stringify(_this.attrs) !== JSON.stringify(attr)) {
            _this.attrs = attr;
            // 1. 获取历史数据，渲染数据，
            let old_val = _this.warp.find('.Js_four_sku_input').val();
            old_val = JSON.parse(old_val);
            _this.SKUForm(old_val.sku, 1)
        }
    };

    // 生成具体的SKU配置表单

    SKU.prototype.SKUForm = function (default_sku) {

        //
        let _this = this;
        let attr_names = Object.keys(_this.attrs);
        if (attr_names.length === 0) {
            _this.warp.find('.sku_four_edit_warp tbody').html(' ');
            _this.warp.find('.sku_four_edit_warp thead').html(' ');
        } else {
            // 渲染表头
            let thead_html = '<tr>';
            attr_names.forEach(function (attr_name) {
                thead_html += '<th>' + attr_name + '</th>'
            });

            thead_html += '<th style="width: 120px">外部商品编号 </th>';
            thead_html += '<th style="width: 100px">sku </th>';
            thead_html += '<th style="width: 100px">制作工费/g </th>';
            thead_html += '<th style="width: 100px">成色 </th>';
            thead_html += '<th style="width: 100px">定金 <input value="' + _this.commonGoodsDeposit + '" type="text" style="width: 40px" class="Js_deposit"></th>';
            thead_html += '<th style="width: 100px">佣金/g </th>';
            thead_html += '<th style="width: 100px">标准金重/g </th>';
            thead_html += '<th style="width: 100px">库存 <input value="' + _this.commonStock + '" type="text" style="width: 40px" class="Js_stock"></th>';
            thead_html += '</tr>';

            _this.warp.find('.sku_four_edit_warp thead').html(thead_html);

            // 求笛卡尔积
            let cartesianProductOf = (function () {
                return Array.prototype.reduce.call(arguments, function (a, b) {
                    var ret = [];
                    a.forEach(function (a) {
                        b.forEach(function (b) {
                            ret.push(a.concat([b]));
                        });
                    });
                    return ret;
                }, [[]]);
            })(...Object.values(_this.attrs));

            // 根据计算的笛卡尔积渲染tbody
            let tbody_html = '';
            cartesianProductOf.forEach(function (sku_item) {
                tbody_html += '<tr>';
                sku_item.forEach(function (attr_val, index) {
                    let attr_name = attr_names[index];
                    tbody_html += '<td data-field="' + attr_name + '">' + attr_val + '</td>';
                });

                // 3. 添加新的规则值时，保留历史信息
                if (default_sku && type == 1) {
                    let sku_sku_id = _this.commonSkuId;
                    let sku_goods_no = _this.commonGoodsNo;
                    let sku_sku_no = _this.commonSkuNo;
                    let sku_make_charges = _this.commonMakeCharges;
                    let sku_material_type = _this.commonMaterialType;
                    let sku_goods_deposit = _this.commonGoodsDeposit;
                    let sku_commission = _this.commonCommission;
                    let sku_weight = _this.commonWeight;
                    let sku_stock = _this.commonStock;
                    default_sku.forEach(function (item_sku, index) {
                        let skus = Object.values(item_sku);
                        if (sku_item.every(val => skus.includes(val))) {
                            sku_sku_id = item_sku.goods_sku_id;
                            sku_goods_no = item_sku.goods_no;
                            sku_sku_no = item_sku.sku_no;
                            sku_make_charges = item_sku.make_charges;
                            sku_material_type = item_sku.material_type;
                            sku_goods_deposit = item_sku.goods_deposit;
                            sku_commission = item_sku.commission;
                            sku_weight = item_sku.weight;
                            sku_stock = item_sku.stock;
                        }
                    })
                    tbody_html += '<td data-field="goods_sku_id" style="display:none"><input value="' + sku_sku_id + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="goods_no"><input value="' + sku_goods_no + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="sku_no"><input value="' + sku_sku_no + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="make_charges"><input value="' + sku_make_charges + '" type="text" class="form-control"></td>';
                    tbody_html += '<td><select class="sel form-control"></select></td>';
                    tbody_html += '<td data-field="material_type" style="display:none"><input value="' + sku_material_type + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="goods_deposit"><input value="' + sku_goods_deposit + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="commission"><input value="' + sku_commission + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="weight"><input value="' + sku_weight + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="stock"><input value="' + sku_stock + '" type="text" class="form-control"></td>';
                } else {
                    tbody_html += '<td data-field="goods_sku_id" style="display:none"><input value="' + _this.commonSkuId + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="goods_no"><input value="' + _this.commonGoodsNo + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="sku_no"><input value="' + _this.commonSkuNo + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="make_charges"><input value="' + _this.commonMakeCharges + '" type="text" class="form-control"></td>';
                    tbody_html += '<td><select class="sel form-control"></select></td>';
                    tbody_html += '<td data-field="material_type" style="display:none"><input value="' + _this.commonMaterialType + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="goods_deposit"><input value="' + _this.commonGoodsDeposit + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="commission"><input value="' + _this.commonCommission + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="weight"><input value="' + _this.commonWeight + '" type="text" class="form-control"></td>';
                    tbody_html += '<td data-field="stock"><input value="' + _this.commonStock + '" type="text" class="form-control"></td>';

                }

                tbody_html += '</tr>'
            });
            _this.warp.find('.sku_four_edit_warp tbody').html(tbody_html);

            // k金数组
            var arr = [{label: "18K", value: "0.755"}];
            var json = JSON.stringify(arr);
            var obj = JSON.parse(json);//解析字符串---解析成object数组
            for (var i = 0; i < obj.length; i++) {
                var pro = obj[i];
                $("select[id=sel]").each(function () {
                    $(this).append("<option value='pro.value'>" + pro.label + "</option>");
                });
            }

            if (default_sku) {
                // 填充数据
                default_sku.forEach(function (item_sku, index) {
                    let tr = _this.warp.find('.sku_four_edit_warp tbody tr').eq(index);
                    Object.keys(item_sku).forEach(function (field) {
                        let input = tr.find('td[data-field="' + field + '"] input');
                        if (input.length) {
                            input.val(item_sku[field]);
                            let sku_upload = tr.find('td[data-field="' + field + '"] .Js_sku_upload');
                            if (sku_upload.length) {
                                sku_upload.css('background-image', 'url(' + item_sku[field] + ')');
                            }
                        }
                    })
                });
            }

        }


        _this.processSku()
    };

    // 处理最终SKU数据，并写入input
    SKU.prototype.processSku = function () {
        let _this = this;
        let sku_json = {};
        sku_json.type = _this.warp.find('.sku_four_attr_select .btn.btn-success').attr('data-type');
        if (sku_json.type === 'many') {
            // 多规格
            sku_json.attrs = _this.attrs;
            let sku = [];
            _this.warp.find('.sku_four_edit_warp tbody tr').each(function () {
                let tr = $(this);
                let item_sku = {};
                tr.find('td[data-field]').each(function () {
                    let td = $(this);
                    let field = td.attr('data-field');
                    let input = td.find('input');
                    if (input.length) {
                        item_sku[field] = input.val();
                    } else {
                        item_sku[field] = td.text();
                    }
                });
                sku.push(item_sku);
            });
            sku_json.sku = sku;
        }
        _this.warp.find('.Js_four_sku_input').val(JSON.stringify(sku_json));
    };

    // 图片上传
    SKU.prototype.upload = function (obj) {
        let _this = this;
        // 创建input[type="file"]元素
        let file_input = document.createElement('input');
        file_input.setAttribute('type', 'file');
        file_input.setAttribute('accept', 'image/x-png,image/jpeg');

        // 模拟点击 选择文件
        file_input.click();

        file_input.onchange = function () {
            let file = file_input.files[0];  //获取上传的文件名
            let formData = new FormData();
            formData.append('file', file);
            formData.append('_token', LA.token);
            // 使用ajax上传文件
            $.ajax({
                type: "POST",
                url: UploadHost,
                data: formData,
                contentType: false, //告诉jQuery不要去设置Content-Type请求头
                headers: {
                    Accept: "application/json"
                },
                processData: false, //告诉jQuery不要去处理发送的数据
                success: function (res) {
                    obj.css('background-image', 'url(' + res.url + ')');
                    obj.parent().find('input').val(res.url);
                    _this.processSku()
                }
            })
        }
    };

    window.SkuFour = SKU;
})();
