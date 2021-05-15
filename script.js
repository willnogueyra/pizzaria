let modalQt = 1;
let cart = [];
let modalKey = 0;

/***  LISTAGEM DAS PIZZAS ***/
pizzaJson.map((item, index)=> {
    // clonando modelo html para dentro da variavel
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    // adicionando atributo data-key como numero da array chamado index
    pizzaItem.setAttribute('data-key', index);
    
    //informações da pizza na area inicial
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;


    // ao clicar na pizza abre o modal, desfaz o evento padrao de abrir em outra aba
    pizzaItem.querySelector('a').addEventListener('click', (event)=> {
        event.preventDefault(); 
        modalQt = 1;
        // proprio elemento event 'a', volta e procura o elemento mais proximo '.pizza-item', pega valor do array do data-key agora chamado key para pegar todas informações de cada pizza dando pizzaJson[key]
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;

        //informações da pizza no modal
        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })
        document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;


        //troca display none por flex e animação do modal
        document.querySelector('.pizzaWindowArea').style.opacity = '0';
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            document.querySelector('.pizzaWindowArea').style.opacity = '1'
        }, 200)
    })

    // adicionando o conteúdo na area inicial
    document.querySelector('.pizza-area').append(pizzaItem)
})

/*** EVENTOS DO MODAL ***/ 
// fecha modal com animação
function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=> {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal)
})

// adiciona ou remove quantidade
document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(modalQt > 1){
    modalQt--;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQt++;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
});

// seleção de tamanhos
document.querySelectorAll('.pizzaInfo--size').forEach((size)=>{
    size.addEventListener('click', ()=> {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
})

// pega informações e bota no carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size; 

    // verificação em cada item no carrinho se tem o mesmo identifier, se não, retorna -1
    let key = cart.findIndex((item)=> {
        return item.identifier == identifier
    });

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
})

document.querySelector('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        document.querySelector('aside').style.left = '0';
    }
})
document.querySelector('.menu-closer').addEventListener('click', () => {
        document.querySelector('aside').style.left = '100vw';
})

/*** CARRINHO ***/
function updateCart() {
    document.querySelector('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        document.querySelector('aside').classList.add('show');
        document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) { 
            //procura a pizza no array pizzaJson que corresponde a pizza atual do carrinho.
            let pizzaItem = pizzaJson.find((item) => { 
                return item.id == cart[i].id;
            })

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt > 1){
                    cart[i].qt--
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++
                updateCart();
            });
            document.querySelector('.cart').append(cartItem)
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        document.querySelector('aside').classList.remove('show')
        document.querySelector('aside').style.left = '100vw'
    }
}
