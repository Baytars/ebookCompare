function search(){
    var search_string = $('#search-string').val()

    $.get({
        type: 'get',
        url: 'https://yuedu.baidu.com/search/booksearchasync?word='+search_string,
        success: function(res){
            $.each(res.data.book_list, function(i, item){
                var img_ele = document.createElement('img')
                img_ele.src = item.img_url

                $('#result').append(
                    "<dt>" + item.title + "</dt>" +
                    "<dd>" + "<label>" + "价格" + "：</label>" + item.price + "</dd>" +
                    "<dd>" + "<label>" + "电子价格" + "：</label>" + item.e_price + "</dd>" +
                    "<dd>" + img_ele.outerHTML  + "</dd>" +
                    "<dd>" + "<label>" + "摘要" + "：</label>" + item.abstract + "</dd>" +
                    "<dd>" + "<label>" + "作者" + "：</label>" + item.author + "</dd>" +
                    "<dd>" + "<label>" + "出版社" + "：</label>" + item.publisher + "</dd>"
                )
            })
        },
        error: function(){
            alert('fail')
        }
    })
}