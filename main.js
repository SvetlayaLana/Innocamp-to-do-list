document.querySelector('#button-add').addEventListener('click', function(){
    document.querySelector('#modal').style.display = 'block';
});

document.querySelector('#modal').addEventListener('click', function(e){
    if(e.target === this){
        this.style.display = 'none';
    }    
});


