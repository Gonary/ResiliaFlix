function pegarId(){
    const pegarNomeId = location.search.substr(4)//location é local onde está o site no momento.
    $.ajax({
        "url" : `http://www.omdbapi.com/?apikey=b1d50f7f&i=${pegarNomeId}&plot=full`, //s=${conversao} O s trás todas as informações de todos os filmes existente
        "success" : function(result){
            let filmes = new Filmes(result);
            filmes.mostrarFilmes()
            
        },
        'error':function(erro){
        }
      });
}

pegarId()

$('.botao').click(function(event){
    event.preventDefault()
    let resposta = $('.resposta').val().split(" ")
    let conversao = resposta.join(`+`)
    $.ajax({
        //requesição de todos os filmes de acordo com a pesquisa.
        "url" : `http://www.omdbapi.com/?apikey=708a483d&S=${conversao}`,
        "success" : (req)=>{
           let recebe = req.Search
             console.log(recebe)
            //passa por dentro da array de filmes recebida.
            let contador = 0;
            
         try{
            for(let i = 0; i < recebe.length; i++){
                //verifica se o o typo realmente é um filme
            if(recebe[i].Type == 'movie'){   
                contador++
                let filmes = new Filmes(recebe[i]);
                filmes.contador = contador  
           }}
           throw new Error('ERRO 404! FILME NÃO ENCONTRADO!')}
           catch(error) {
        
            $(`#posicao-filmes`).html(`<h1 class="erro">ERRO 404! FILME NÃO ENCONTRADO!`)
           }    
            

            $.ajax({
                //requisiçao de todas(FULL) as informações de cada filme.
                "url" : `http://www.omdbapi.com/?apikey=708a483d&t=${recebe[i].Title}&plot=full`,
                "success" : (req)=>{
                    filmes.pegaInfo(req.Plot, req.Genre, req.Runtime)

                
                    },
                
                'error':function(erro){
                    
                }
            });
                    filmes.mostrarFilmes()
        },
        'error':function(erro){
            $('#posicao-filmes').html('<h1 class="erro">FILME NÃO ENCONTRADO!</h1>')
        }
    });
});


class Filmes{
    constructor(results){
        this.contador = 0;
        this.img = results.Poster;
        this.nome = results.Title;
        this.descricao = results.Plot;
        this.ano = results.Year;
        this.lancamento = results.Released;
        this.duracao = results.Runtime;
        this.genero = results.Genre;
        this.diretor = results.Director;

    }

     pegaInfo(descricao, genero, duracao){
        this.descricao = descricao;
        this.genero = genero;
        this.duracao = duracao;
    }    


    mostrarFilmes(){
        $(`#posicao-filmes`).html(`<div id="posicao-filmes"></div>`)

        setTimeout(() => {
            
             $(`#posicao-filmes`).append(`
           <div class="filmes">
            <h1 class='titulo'>${this.nome}</h1>
            <button type="button" class="btn" data-toggle="modal" data-target="#exampleModal${this.contador}"><img src = ${this.img}></button>
            
            <div class="modal fade" id="exampleModal${this.contador}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div id="modalTeste" class="modal-content ">
                        <div class="modal-header">
                            <h1  class="modal-title titulo texto" id="exampleModalLabel">${this.nome}</h1>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img src = ${this.img}>
                            <p class='texto descricao'>${this.descricao}</p>
                            <p class='texto'>${this.ano}</p><p>||</p><p class='texto'>${this.genero}</p><p>||</p><p class='texto'>${this.duracao}</p>
                            </div></div>
                        </div>
                    </div>
                </div>
            </div>
            
            `)
        }, 500);              
    }

   
}


