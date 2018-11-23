function search(){
    $('#msg').empty()
    $('#result').empty()
    
    var search_string = $('#search-string').val()

    baiduSequence(search_string)
}

function baiduSequence(search_string){
    sendMessage('正在查询百度阅读 ...')

    queryBaidu('https://yuedu.baidu.com/search/booksearchasync?word='+search_string, function(res){
        var total = res.data.total
        sendMessage('在百度阅读搜索到'+total+'个结果')

        sendMessage('正在打印第1-20个结果')
        if(total!=0){
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