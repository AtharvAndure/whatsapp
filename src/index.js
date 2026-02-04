async function load(filename,event){
            if(!event && !filename){
                return;
            }else{
                const div=document.getElementsByClassName('left-items')[0];
                const file=await fetch(filename);
                console.log("file="+file);
                const text=await file.text();
                console.log("text"+text);
                div.innerHTML=text;
            }


}