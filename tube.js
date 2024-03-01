let sortByView = false;
let selectedCategoryId = 1000;

// for sorted views
const sortViewBtn = document.getElementById('sort-btn');
sortViewBtn.addEventListener('click', () => {
    sortByView = true;
    displayCard(selectedCategoryId, sortByView);

});




// for convert milliseconds to minutes and hours
function convertTime(milliseconds) {
    let totalMinutes = Math.floor(milliseconds / (1000 * 60));
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    return { hours, minutes };
}
const x = new Date("16278")
const y = new Date()
const difference = x - y
const { hours, minutes } = convertTime(difference);
console.log(hours, minutes);



// All category Loaded
const loadName = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/videos/categories');
    const data = await res.json();
    const categories = data.data;
    const btnContainer = document.getElementById('btn-container');

    categories.forEach((category) => {
        const div = document.createElement('div');
        // another way
        /* button.classList=`btn  btn-ghost bg-slate-700 text-white text-lg`;
        button.innerText = category.category;
        btnContainer.appendChild(button); */
        div.innerHTML = `<button onclick="displayCard('${category.category_id}')" class="btn changeBg btn-ghost bg-slate-700 text-white text-lg ">${category.category}</button>`
        btnContainer.appendChild(div);
    });

}






// Category Details Loaded
const displayCard = async (id, sortByView) => {
    selectedCategoryId = id;
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
    const data = await res.json();

    // for sorted views
    if (sortByView) {
        data.data.sort((a, b) => {
            const firstSortByView = a.others?.views;
            const secondSortByView = b.others?.views;
            const finalFirstView = parseFloat(firstSortByView.replace('K', '')) || 0;
            const finalSecondView = parseFloat(secondSortByView.replace("K", '')) || 0;
            const totalView = finalSecondView - finalFirstView;
            return totalView;
        })
    }

    // change background color
    const changeBtnBg = document.getElementsByClassName('changeBg');
    for (const btn of changeBtnBg) {
        btn.addEventListener('click', () => {
            for (const bg of changeBtnBg) {
                bg.classList.remove('bg-red-600');
            }
            btn.classList.add('bg-red-600');
        });
    }

    // error element 
    const errorElement = document.getElementById('error-element');
    if (data.data.length === 0) {
        errorElement.classList.remove('hidden');
    }
    else {
        errorElement.classList.add('hidden');

    }

    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    data.data.forEach((card) => {
        let verifiedBadge = '';
        if (card.authors[0].verified) {
            verifiedBadge = `<img class="w-6 h-6" src="./images/verify.png" alt=""></img>`
        }
        console.log(card);
        console.log(card.others.posted_date);

        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card w-full bg-base-100 shadow-xl">
                <figure class="overflow-hidden h-72">
                    <img class="w-full h-full py-2" src="${card.thumbnail}" alt="Shoes" />
                    <h6 class="absolute bottom-[40%] text-white font-semibold right-12">${convertTime(card.others.posted_date)}</h6>
                </figure>
                <div class="card-body">
                    <div class="flex space-x-4 justify-start items-start">
                        <div>
                            <img class="w-12 h-12 rounded-full" src="${card.authors[0].profile_picture}" alt="Shoes" />
                        </div>
                        <div>
                            <h2 class="card-title">${card.title}</h2>
                            <div class="flex mt-3">
                                <p class="">${card.authors[0].profile_name}</p>
                               
                                ${verifiedBadge}
                            </div>
                            <p class="mt-3">${card.others.views}</p>
                        </div>
                    </div>
                </div>
            </div>
       
        `
        cardContainer.appendChild(div);
    });
}


loadName();
displayCard(selectedCategoryId, sortByView);