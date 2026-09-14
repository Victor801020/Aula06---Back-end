const express = require('express')
const app = express();
const PORT = 3000;

// Middleware para permitir  leitura de JSON em req.body
app.use(express.json());
// OBRIGATÓRIO: Habilitar o parser de corpo JSON no Express
app.use(express.json());
// BANCO DE DADOS EM MEMÓRIA
let pizzas  = [
    {
        id:1,
        Sabor:'Calabresa',
        Tamanho:'Média (6 pedaços)',
        Borda_Recheada:false,
        Preço:45.00
    },
    {
        id:2,
        Sabor:'Quatro Queijo',
        Tamanho:'Média (6 pedaços)',
        Borda_Recheada:true,
        Preço:60.00
    },
    {
        id:3,
        Sabor:'Portuguesa',
        Tamanho:'Grande (8 pedaços)',
        Borda_Recheada:false,
        Preço:65.00
    }
];

// ROTA 1: GET /alunos(listar todos os alunos) status 200 ok
app.get('/pizzas', (req, res)=>{
    return res.status(200).json(pizzas);
});

//Rota para Buscar Uma Pizza específica pelo o id (Parametro de Rota)
app.get('/pizzas/:id', (req,res)=>{
    const{id} = req.params; // Etrai o ID da URL
// Procura a pizza no array em memória
    const pizza = pizzas.find(p => p.id === parseInt(id));
// Caso o produto não exista, retorna 404 Not Founf
    if(!pizza){
        return res.status(404).json({ mensagem: 'Produto não encontrado.'});
    }
// Se existir, retorna 200 OK com os dados do produto encontrado
    return res.status(200).json(pizza);
});

//Rota2: para aplicar o post


// Rota para Cadastrar um Novo Produto
app.post('/pizzas', (req, res)=>{

//Extrai as informações enviadas pelo cliente no corpo (body) a requisição
    const {Sabor,Preço} = req.body;

// Validação simples dos dados recebidos
    if(!Sabor || Preço === undefined){
        return res.status(400).json({mensagem: 'Nome e Preço são obrigatorios'});
    };

//Criação do novo registro com indentificador único incremental
    const novaPizza = {
        id: pizzas.length > 0 ? pizzas[pizzas.length -1].id + 1:1,
        Sabor,
        Preço: Number(Preço)
    };

    pizzas.push(novaPizza);

// RESTful: Retorna HTTP Status 201 Created + Objeto Criado
    return res.status(201).json({
        mensagem: 'Produto cadastrado com sucesso!',
        Sabor: novaPizza
    });
});

//Rota para Autualizar um Produto Existente
app.put('/pizzas/:id', (req, res) => {
    const {id} = req.params; // ID na URL
    const {Sabor,Preço} = req.body // Novos dados no Body

//Localiza a posição do produto no array
    const index = pizzas.findIndex(p => p.id === parseInt(id));

//Caso o produto não exista no banco/memória
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado para atualização'});

    }

// Atualiza os dados mantendo o ID original
    pizzas[index] = {
        ...pizzas[index],
        Preço: Preço !== undefined ? Number(Preço) : pizzas[index].Preço
    };

// Retorna HTTP Status 200 OK com o registro autualizado
    return res.status(200).json({
        mensagem: 'Produto autualizado com sucesso!',
        Sabor: pizzas[index]
    })
});

//ROTA PARA DELETAR UM PRODUTO ID
app.delete('/pizzas/:id', (req,res) =>{
    const {id} = req.params;

//Encontre a posição do item
    const index = pizzas.findIndex(p=> p.id === parseInt(id));

// Se não existir, retornar 404 Not Found
    if (index=== -1) {
      return res.status(404).json({mensagem: 'Pizza não encontrado para exclusão'});
    }

// Remove o elemento do array em memória
    pizzas.splice(index,1);

// Retorna HTTP Status 200 OK com mensagem de confirmação
    return res.status(200).json({
        mensagem: `Produtos com ID ${id} removio com sucesso!`
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
})     