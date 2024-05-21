console.log('script');

let currentsong=new Audio();


async function getSongs(){
    let a = await fetch('http://127.0.0.1:5500/songs/');
    let response=await a.text();
    console.log(response);
    let div = document.createElement('div');
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    console.log(as);
    let songs=[];
    for(let index=0; index <as.length;index++){
        const element=as[index];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



const playMusic=(track,pause=false)=>{
    currentsong.src="/songs/"+track;
    if(!pause){
        currentsong.play();
        play.src="pause.svg";
    }
    play.src="play.svg";
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}


async function main(){

let songs=await getSongs();
console.log(songs);


let songUL=document.querySelector('.songList').getElementsByTagName('ul')[0];
console.log(songUL);
for(const song of songs){
    console.log(song);
    songUL.innerHTML=songUL.innerHTML+ `
    <li>
                            <img  class="invert" src="./music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Harry</div>
                            </div>
                            <div  class="play-now">
                                <span>
                                    Play now
                                </span>
                                <img  class="invert" src="./play-circle-stroke-rounded.svg" alt="">
                            </div>
                            
                        </li>
    `;
}



Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    /*
    console.log("ele",e.target.getElementsByTagName('li').forEach(e=>{
        console.log(e.target.getElementsByTagName('div')[0]);
    }));        
    */
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    })

});
console.log("PLAY"+play);

play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src="pause.svg";
    }
    else{
        currentsong.pause();
        play.src="play.svg";
    }
})

currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}:${
        secondsToMinutesSeconds(currentsong.duration)
    }`;
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
});

document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentsong.currentTime=((currentsong.duration)*percent)/100;    
});


}


main();

/*
var audio=new Audio(songs[0]);
audio.play();
audio.addEventListener("loadeddata",()=>{
    let duration=audio.duration;
    console.log(audio.duration,audio.currentSrc,audio.currentTime);
});
*/