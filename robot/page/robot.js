function send(event){
    if (event.key !== 'Enter' && event instanceof KeyboardEvent) {
        return
    }
    var op = document.createElement('p');
    var ipt = document.getElementById('ipt');
    var content = document.getElementsByClassName('content')[0];
    op.innerText = '我: ' + ipt.value;
    op.style.color = 'red';
    op.style.fontSize = '14px';
    content.appendChild(op);
    var h = content.offsetHeight;
    console.log(h);

    var ajax = new XMLHttpRequest();
    ajax.open('GET','http://172.20.10.4:12345/chat?text=' + ipt.value,true);
    ajax.send();
    ajax.onreadystatechange = function(){
        if (ajax.status == 200 && ajax.readyState == 4){
            var text = JSON.parse(ajax.responseText).text;
            var p = document.createElement('p');
            p.innerText = '机器人: ' + text;
            p.style.fontSize='16px'
            content.appendChild(p);
            ipt.value = '';
            var len = document.getElementsByTagName('p').length;
            var lastP = document.getElementsByTagName('p')[len-1];
            if (content.offsetHeight - lastP.offsetTop < 0){
                document.getElementsByClassName('content')[0].scrollTop = lastP.offsetTop- content.offsetHeight;
            }
        }
    }

}



// 31a329bfc39a406ea4ff5e93ad7fe4a9