import './main.scss'
import 'knockout'
const axios = require('axios').default;

//load local storage
window.addEventListener("load", function(event) {
    //salva nome
    if (localStorage.nomedog == undefined){
        document.querySelector("#nameDog").innerHTML = '';
    }
    else{
        document.querySelector("#nameDog").innerHTML = localStorage.nomedog;
    }
    //salva foto
    if (localStorage.photoDog == undefined){
        document.querySelector('#dogImage').setAttribute('src', 'https://dog.ceo/img/dog-api-logo.svg');
    }
    else{
        document.querySelector('#dogImage').setAttribute('src', localStorage.photoDog);
    }
    //salva cor
    document.querySelector("#nameDog").setAttribute('alt', localStorage.corFonte);
    //salva fonte
    document.querySelector("#nameDog").setAttribute('class', localStorage.fonteSelecionada);
});

function carregaRacas(){
    axios.get('https://dog.ceo/api/breeds/list/all')
    .then(function(response){      
        //CARREGA SELECT COM AS RAÇAS
        const racas = Object.keys(response.data.message);
        const selectRaca = document.querySelector("#raca");

        for (let i = 0; i < racas.length; i++) {
            const option = document.createElement('option');
            option.text = racas[i];
            selectRaca.add(option);
        }
        const selectElement = document.querySelector('#raca');
    
        //ESCOLHA DO SELECT SUB-RAÇAS
        selectElement.addEventListener('change', (event) => {
            let nameDog = document.querySelector('#raca').value;
            let posicaoRaca = document.querySelector("#raca").selectedIndex;
            let subraca = Object.values(response.data.message)[posicaoRaca - 1];           
            const selectSubRaca = document.querySelector("#subraca");
            selectSubRaca.options.length=0;
            selectSubRaca.style.display = 'none';

            for (let i = 0; i < subraca.length; i++) {
                const optionRaca = document.createElement('option');
                optionRaca.text = subraca[i];
                selectSubRaca.add(optionRaca);
                selectSubRaca.style.display = 'inline-block';
            }
            
            //ALTERA IMAGEM RAÇA ESCOLHIDA
            axios.get('https://dog.ceo/api/breed/'+nameDog+'/images/random')
            .then(function(response){  
                let urlPhotoDog = response.data.message;
                document.querySelector('#dogImage').setAttribute('src',urlPhotoDog);
            });   
        });
    });
}
carregaRacas();

//NOME CACHORRO
ko.applyBindings({myName: ko.observable('')});

//ALTERA COR FONTE NOME CACHORRO
function changeColor(){
    const coresNome = document.querySelector('#coresNome');
    const tituloDog = document.querySelector('#nameDog');
    coresNome.addEventListener('change', (event) => {
        const corSelecionada = document.querySelector('#coresNome').value;
        tituloDog.setAttribute('alt',corSelecionada);
    });
}
changeColor();

//ALTERA FONTE FAMILY NOME CACHORRO
function changeFont(){
    const fonteNome = document.querySelector('#fonteFamily');
    const tituloDog = document.querySelector('#nameDog');
    fonteNome.addEventListener('change', (event) => {
        let fonteSelecionada = document.querySelector('#fonteFamily').value;
        fonteSelecionada = fonteSelecionada.replace(/\s+/g, '-').toLowerCase();
        tituloDog.setAttribute('class',fonteSelecionada);
    });
}
changeFont();

//SALVA LOCAL STORAGE
function saveLocalStorage(){
    const btnSalvar = document.querySelector('#btnSalvar');
    btnSalvar.addEventListener('click', event => {
       // Salva nome do cachorro
        const tituloDog = document.querySelector('#nameDog').textContent;
        localStorage.setItem("nomedog", tituloDog);
        //Salva foto do cachorro
        const photoDog = document.querySelector('#dogImage').src;
        localStorage.setItem("photoDog", photoDog);
        //Salva cor da fonte
        const coresNome = document.querySelector('#nameDog');
        const corSelecionada = coresNome.attributes.alt.textContent;
        localStorage.setItem("corFonte", corSelecionada);
        //Salva font family
        const fonteSelecionada = coresNome.attributes.class.textContent;
        localStorage.setItem("fonteSelecionada", fonteSelecionada);
        //Salva data e hora
        let horadata = new Date()
        localStorage.setItem("hora-e-data", horadata);

        //Mensagem de sucesso
        document.querySelector('.mensagemSucesso').style.display='block';
        setTimeout(function () {
            document.querySelector('.mensagemSucesso').style.display='none';
        }, 5000);
    });
}
saveLocalStorage();