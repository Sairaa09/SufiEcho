function secondsToMinutesSeconds(totalSeconds) {
    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format with leading zeros and ensure 2 digits for both
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}




let songs;
let crrFolder;
let cardContainer = document.querySelector(".card-container")
let currentSong= new Audio();
async function getsongs(folder) {
  crrFolder=folder;
  let a = await fetch(`/${folder}/`);

  let response = await a.text();
  

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  
  
  

   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      // console.log(element.href)
      songs.push(element.href.split(`${folder}/`)[1]);
    
        
    }
  }
  // console.log(songs);
  


  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
    songUl.innerHTML=" "
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML + `<li> <img src="images/music.svg" alt="music" class="invert">
            <div class="info">
              <div>${decodeURI(song)}</div>
              <div>Saira</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
              <img class="invert" src="images/play.svg" alt="play">
            </div>
    
      </li>`;
  }


   // attach an event listener to each song
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
    element.addEventListener("click",()=>{
      
      
    //  console.log(element.querySelector(".info").firstElementChild.innerHTML);
     
   playMusic(element.querySelector(".info").firstElementChild.innerHTML)     
        
  })    
  
});


    
return songs;
  
}
  
getsongs();

const playMusic=(track, pause=false)=>{
currentSong.src=`/${crrFolder}/`+track;
// console.log(currentSong.src);

if(!pause){
  currentSong.play();
  play.src="images/pause.svg";
  
}
 document.querySelector(".musicinfo").innerHTML=decodeURI(track);
 document.querySelector(".musictime").innerHTML="00:00/00:00"
}

async function displayAlbums(){


  let a = await fetch("/musics/");

  let response = await a.text();
  

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors=div.getElementsByTagName("a");
  // console.log(anchors);
 let array= Array.from(anchors);
 for (let index = 0; index < array.length; index++) {
   const e = array[index];
  

  
 
 
    // let correctHref = new URL(e.getAttribute("href"), "/musics/");
    // console.log(correctHref.href);
    if(e.href.includes("/musics")){
      let folder=e.href.split("/").slice(-2)[0];
      // console.log(folder);
      
      // get meta data of the folder
      let a = await fetch(`/musics/${folder}/info.json`);
      let response =  await a.json();
      // console.log(response);

      cardContainer.innerHTML =  cardContainer.innerHTML + `<div class="card" data-folder=${folder}>
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
          </div>
        <img src="/musics/${folder}/cover.jpg">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
      
      
    }
    
  }
    // add event listener to album folder
    Array.from(document.getElementsByClassName("card")).forEach((e)=>{
      e.addEventListener("click",async(item)=>{
       
       
        songs = await getsongs(`musics/${item.currentTarget.dataset.folder}`);
        
        playMusic(songs[0])
        
      })
    })

  




}

async function main() {
   

//Get all songs
    await getsongs("musics/naat");


    // Display all the albums on the page

displayAlbums();
   
  
  
    playMusic(songs[0],true)


   
    
  
    // attach an event listener to play , next and previous
  
    play.addEventListener("click",()=>{
      if(currentSong.paused){
          currentSong.play();
          play.src="images/pause.svg"
      }
      else{
          currentSong.pause();
          play.src="images/play.svg"
      }
    })
  
    currentSong.addEventListener("timeupdate",()=>{
      document.querySelector(".musictime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`
     
     
  
      document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
      if (currentSong.currentTime === currentSong.duration) {
        play.src = "images/play.svg";
        document.querySelector(".circle").style.left = 0 + "%";

      }
    })



     // add an event listener to seek bar

  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width*100);
   
    
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=((currentSong.duration)*percent)/100
    
  })

  // add an event listener for menu  show


  document.querySelector(".menu").addEventListener("click",()=>{
    document.querySelector(".left").style.left=0;
  })

  // add event listener for menu cross

  document.querySelector(".cross-menu").addEventListener("click",()=>{
    document.querySelector(".left").style.left=  -100 +"%";
  })

  // add event listener to previous and next

  previous.addEventListener("click",()=>{
    // console.log(currentSong.src)
  // console.log(  currentSong.src.split("/").slice(-1)[0])
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // console.log(index)
   
    if(index-1>=0){

      playMusic(songs[index-1])
    }

  })


  next.addEventListener("click",()=>{
   
    currentSong.src.split("/").slice(-1)[0];
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // console.log(songs);

    
    if(index+1 < songs.length){
    
      playMusic(songs[index+1])
    }
  })
 


    // add an event listener to volume range
    let img=document.querySelector(".volume").getElementsByTagName("img")[0]
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     
      
      currentSong.volume = (Number(e.target.value) / 100);
      if (currentSong.volume > 0) {
        img.src = img.src.replace("images/mute.svg", "images/volume.svg");
        //  console.log(img.src)
      }
      
    })
 
  // add event listener to volume icon

  

  img.addEventListener("click",(e)=>{
  if(e.target.src.includes("images/volume.svg")){
    e.target.src=e.target.src.replace("images/volume.svg", "images/mute.svg");
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
  }
  else{
    e.target.src=e.target.src.replace("images/mute.svg","images/volume.svg");
    currentSong.volume=.10
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
  }
   
  })


}
main();
