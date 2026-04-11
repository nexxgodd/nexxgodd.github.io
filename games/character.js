//read manifest
var manifest=[
"Batman",
"Eevee",
"Mickey_Mouse",
"Spider-Man",
"Bowser",
"Goofy",
"Minnie_Mouse",
"Squirtle",
"Bulbasaur",
"Jigglypuff",
"Pikachu",
"Superman",
"Charmander",
"Kirby",
"Pluto",
"Toad",
"Chip_and_Dale",
"Link",
"Princess_Peach",
"Waluigi",
"Donald_Duck",
"Luigi",
"Samus_Aran",
"Wario",
"Donkey_Kong",
"Mario",
"Snow_White",
"Yoshi"
];


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function addNextCard(name){
	let cleanName=name.replaceAll("_"," ");
	console.log(cleanName);

	// let out=`
	// <div class="carousel-item h-100">
	// 	<div class="card user-select-none border-0 bg-secondary  h-100"
	// 		onmousedown="reveal(this, true)" ontouchstart="reveal(this, true)" ontouchend="reveal(this, false)" onmouseup="reveal(this, false)" onmouseleave="reveal(this, false)">

	// 		<div class="unlocked card-body d-flex flex-column p-5 pointy">
	// 			<i class="bi bi-file-lock2 fs-1"></i>
	// 			<p class="card-text fw-semibold mb-0">Press here</br> to reveal</p>
	// 		</div>

	// 		<div class="unlocked card-body d-none d-flex flex-column align-items-center overflow-hidden">
	// 			<img src="/resources/sharaydz/${name}.png" class="p-5 d-block  object-fit-contain mypics" alt="Slide 1"/>
	// 			<div class="">${cleanName}</div>
	// 		</div>
	// 	</div>
	// </div>`;
	    let out=`
    <div class="carousel-item h-100">
        <div class="card user-select-none border-0 bg-secondary h-100"
            onmousedown="reveal(this, true)" ontouchstart="reveal(this, true)" ontouchend="reveal(this, false)" onmouseup="reveal(this, false)" onmouseleave="reveal(this, false)">
            <div class="locked card-body d-flex flex-column p-5 pointy h-100 justify-content-center" >
                <i class="bi bi-file-lock2 mylock"></i>
                <p class="card-text fw-semibold mb-0">Press here</br> to reveal</p>
            </div>
            <div class="unlocked card-body h-100 d-flex flex-column align-items-center d-none">
                <img src="/resources/sharaydz/${name}.png" class=" d-block w-100 img-fluid mypics" alt=""/>
                <div class="">${cleanName}</div>
            </div>
        </div>
    </div>`;
	document.getElementById("carousel").innerHTML+=out;
}

function reveal(card, show) {
	card.querySelector('.locked').classList.toggle('d-none', show);
	card.querySelector('.unlocked').classList.toggle('d-none', !show);
}





shuffleArray(manifest);

manifest.forEach(addNextCard);

// Re-lock each slide when the carousel moves away from it
document.getElementById('carousel').addEventListener('slide.bs.carousel', e => {
	const leaving = e.from !== undefined
	? document.querySelectorAll('.carousel-item')[e.from]
	: null;
	if (leaving) {
	reveal(leaving.querySelector('.card'), false);
	}
});