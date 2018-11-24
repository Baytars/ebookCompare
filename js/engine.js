function search(){
    $('#msg').empty()
    $('#result').empty()
    
    var search_string = $('#search-string').val()

    baiduSequence(search_string)
    // dangdangSequence(search_string)
    // jdSequence(search_string)
}

function jdSequence(search_string){
    $('#jd-buffer-1').empty()
    $('#jd-buffer-2').empty()
    sendMessage('正在查询京东 ...')

    queryJD('http://s-e.jd.com/Search?enc=utf-8&key='+search_string, function(res){
        $('#jd-buffer-1').append(res)
        var total = Number($('.num:first').text())
        if(total!=0){
            sendMessage('在京东搜索到'+total+'个结果')
            // query price first
            var price_tags = new Array()
            $.each($('.p-price strong'), function(i, item){
                price_tags.push(item.getAttribute('id'))
            })
            queryJD('http://p.3.cn/prices/mgets?skuids='+price_tags.join(','), function(res_again){
                sendMessage('正在打印第1-30个结果')
                JDOutput(res_again)
                
                for(i=0;((i+1)*30)<total;i++){
                    var page_count = i+2
                    var min = (i+1)*30 + 1
                    var max = page_count*30
                    sendMessage('正在打印第'+min+'-'+max+'个结果')
                    queryJD('http://s-e.jd.com/Search?enc=utf-8&key='+search_string+'&page='+page_count, function(res_3rd){
                        $('#jd-buffer-1').append(res_3rd)
                        price_tags = new Array()
                        $.each($('.p-price strong'), function(n, item){
                            price_tags.push(item.getAttribute('id'))
                        })
                        queryJD('http://p.3.cn/prices/mgets?skuids='+price_tags.join(','), function(res_4th){
                            JDOutput(res_4th)
                        })
                    })
                }
            })
        }
        else{
            sendMessage('在京东未查到结果')
        }

        sendMessage('京东检索完毕')
    })
}

function JDOutput(res){
    $.each($('#J_goodsList .gl-item'), function(i, item){
        $('#jd-buffer-2').append(item)

        var img_ele = document.createElement('img')
        var img_div = item.getElementsByClassName('p-img')[0]
        var img_tag = img_div.getElementsByTagName('img')[0]
        // alert(img_tag.getAttribute('src')+item.innerHTML)

        img_ele_src = img_tag.getAttribute('src')
        // Neither img_tag['src'] nor img_tag.src will get the complete image url.
        if(img_ele_src==null){
            img_ele.src = 'http:'+ img_tag.getAttribute('data-lazy-img')
        }
        else{
            img_ele.src = 'http:'+ img_ele_src
        }

        var title_div = item.getElementsByClassName('p-name')[0]
        var title_tag = title_div.getElementsByTagName('em')[0]

        // alert(i)
        
        $('#result').append(
            "<li>" +
            "<div>" + "<label>" + "来源" + "：</label>" + "京东" + "</div>" +
            "<div>" + title_tag.innerText + "</div>" +
            "<div>" + "<label>" + "现价" + "：</label>" + res[i]['p'] + "</div>" +
            "<div>" + "<label>" + "纸书价格" + "：</label>" + res[i]['m'] + "</div>" +
            "<div>" + "<label>" + "原价" + "：</label>" + res[i]['op'] + "</div>" +
            "<div>" + img_ele.outerHTML  + "</div>" +
            "<div>" + "<label>" + "摘要" + "：</label><br>" + item.getElementsByClassName('promo-words')[0].innerText + "</div>" +
            "<div>" + "<label>" + "作者/出版社" + "：</label>" + item.getElementsByClassName('p-bi-name')[0].innerText + "</div>" +
            "</li>"
        )

        $('#jd-buffer-1').empty()
        $('#jd-buffer-2').empty()

    })
}

function queryJD(search_url, successCallback){
    $.get({
        type: 'get',
        url: search_url,
        success: function(res){
            successCallback(res)
        },
        error: function(){
            sendMessage('京东书籍数据请求失败')
        }
    })
}

function dangdangSequence(search_string){
    sendMessage('正在查询当当网 ...')

    queryDangdang('http://e.dangdang.com/media/api.go?action=searchMedia&mediaTypes=1%2C2&keyword='+search_string, function(res){
        var total = res.data.totalCount

        if(total!=0){
            sendMessage('在当当搜索到'+total+'个结果，正在全数打印')
            queryDangdang('http://e.dangdang.com/media/api.go?action=searchMedia&mediaTypes=1%2C2&keyword='+search_string+'&end='+total, function(res_again){
                dangdangOutput(res_again)
            })
        }
        else{
            sendMessage('在当当未查到结果')
        }

        sendMessage('当当网检索完毕')
    })
}

function dangdangOutput(res){
    $.each(res.data.searchMediaPaperList, function(i, item){
        var img_ele = document.createElement('img')
        img_ele.src = item.mediaPic
    
        $('#result').append(
            "<li>" +
            "<div>" + "<label>" + "来源" + "：</label>" + "当当" + "</div>" +
            "<div>" + item.title + "</div>" +
            "<div>" + "<label>" + "销售价" + "：</label>" + item.salePrice + "</div>" +
            "<div>" + "<label>" + "电子价格" + "：</label>" + item.lowestPrice + "</div>" +
            "<div>" + img_ele.outerHTML  + "</div>" +
            "<div>" + "<label>" + "摘要" + "：</label>" + item.description + "</div>" +
            "<div>" + "<label>" + "作者" + "：</label>" + item.author + "</div>" +
            "<div>" + "<label>" + "出版社" + "：</label>" + item.publisher + "</div>" +
            "</li>"
        )
    })
}

function queryDangdang(search_url, successCallback){
    $.get({
        type: 'get',
        url: search_url,
        success: function(res){
            successCallback(res)
        },
        error: function(){
            sendMessage('当当书籍数据请求失败')
        }
    })
}

function baiduSequence(search_string){
    sendMessage('正在查询百度阅读 ...')

    queryBaidu('https://yuedu.baidu.com/search/booksearchasync?word='+search_string, function(res){
        var total = res.data.total

        if(total!=0){
            sendMessage('在百度阅读搜索到'+total+'个结果')
            sendMessage('正在打印第1-20个结果')
            baiduOutput(res)
        }
        else{
            sendMessage('在百度阅读未查到结果')
        }
        
        for(i=0;((i+1)*20)<total;i++){
            // request again
            var pn = (i+1)*20
            var min = pn+1
            var max = min+20
            sendMessage('正在打印第'+min+'-'+max+'个结果')

            queryBaidu('https://yuedu.baidu.com/search/booksearchasync?word='+search_string+'&pn='+pn, function(res_again){
                baiduOutput(res_again)
            })
        }

        sendMessage('百度阅读检索完毕')
    })
}

function queryBaidu(search_url, successCallback){
    $.get({
        type: 'get',
        url: search_url,
        success: function(res){
            successCallback(res)
        },
        error: function(){
            sendMessage('百度阅读书籍数据请求失败')
        }
    })
}

function baiduOutput(res){
    $.each(res.data.book_list, function(i, item){
        var img_ele = document.createElement('img')
        img_ele.src = item.img_url
    
        $('#result').append(
            "<li>" +
            "<div>" + "<label>" + "来源" + "：</label>" + "百度" + "</div>" +
            "<div>" + item.title + "</div>" +
            "<div>" + "<label>" + "价格" + "：</label>" + item.price + "</div>" +
            "<div>" + "<label>" + "电子价格" + "：</label>" + item.e_price + "</div>" +
            "<div>" + img_ele.outerHTML  + "</div>" +
            "<div>" + "<label>" + "摘要" + "：</label>" + item.abstract + "</div>" +
            "<div>" + "<label>" + "作者" + "：</label>" + item.author + "</div>" +
            "<div>" + "<label>" + "出版社" + "：</label>" + item.publisher + "</div>" +
            "</li>"
        )
    })
}

function sendMessage(message){
    $('#msg').prepend('</p>'+message+'</p>')
}