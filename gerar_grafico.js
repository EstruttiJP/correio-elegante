let contadorItens = 0;
const maxItens = 5;

document.getElementById("graficoForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio do formulário

  // Captura os valores do formulário
  const nomesAcesso = document.getElementById("nomesAcesso").value.split(",").map(nome => nome.trim());
  const dica = document.getElementById("dica").value;

  const itens = [];
  const percFalsas = [];
  const percVerdadeiras = [];

  for (let i = 1; i <= contadorItens; i++) {
    const nomeItem = document.getElementById(`itemNome${i}`).value;
    const porcentagemFalsa = document.getElementById(`itemPorcentagemFalsa${i}`).value;
    const porcentagemVerdadeira = document.getElementById(`itemPorcentagemVerdadeira${i}`).value;

    if (nomeItem && porcentagemFalsa && porcentagemVerdadeira) {
      itens.push(nomeItem);
      percFalsas.push(parseInt(porcentagemFalsa));
      percVerdadeiras.push(parseInt(porcentagemVerdadeira));
    }
  }

  // Gera o HTML do gráfico
  const htmlGerado = gerarGraficoPersonalizado(nomesAcesso, dica, itens, percFalsas, percVerdadeiras);

  // Exibe o HTML gerado no textarea
  document.getElementById("htmlPronto").value = htmlGerado;
});

function adicionarItem() {
  if (contadorItens >= maxItens) {
    alert("Você atingiu o número máximo de itens.");
    return;
  }

  contadorItens++;

  // Cria os campos para o item e porcentagens falsa e verdadeira
  const divItem = document.createElement("div");
  divItem.classList.add("item");
  divItem.innerHTML = `
    <div class="small-input">
      <label for="itemNome${contadorItens}">Nome do Item ${contadorItens}:</label>
      <input type="text" id="itemNome${contadorItens}" name="itemNome${contadorItens}" placeholder="Nome do Item" required>
    </div>
    <div class="small-input">
      <label for="itemPorcentagemFalsa${contadorItens}">% Falsa:</label>
      <input type="number" id="itemPorcentagemFalsa${contadorItens}" name="itemPorcentagemFalsa${contadorItens}" placeholder="0" min="0" max="100" required>
    </div>
    <div class="small-input">
      <label for="itemPorcentagemVerdadeira${contadorItens}">% Verdadeira:</label>
      <input type="number" id="itemPorcentagemVerdadeira${contadorItens}" name="itemPorcentagemVerdadeira${contadorItens}" placeholder="0" min="0" max="100" required>
    </div>
  `;

  document.getElementById("itens").appendChild(divItem);
}

// Adiciona pelo menos um item inicial
adicionarItem();

function gerarGraficoPersonalizado(nomes, dica, itens, percFalsas, percVerdadeiras) {
  return `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gráfico de Coração</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="grafico.css">
  </head>
  <body>
    <div class="card principal">
      <h2>
        <span class="heart">❤️</span>
        Gráfico de Coração
        <span class="heart">❤️</span>
      </h2>
      <input type="text" id="check" placeholder="Digite seu nome">
      <button onclick="Checagem()">Calcular</button>
    </div>
  
    <div id="errorCard" class="error-card" style="display: none;">
    <p class="error-message">Ops.. parece que não é para você, tente outro nome!!</p>
    <p class="hint">Dica: ${JSON.stringify(dica)}</p>
</div>
<div id="graphCard" class="card" style="display: none;">
    <canvas id="myChart" width="400" height="400"></canvas>
</div>
<button onclick="exibirGraficoDois()" class="botao" style="display: none;">Exibir o verdadeiro</button>
<div id="graphCardDois" class="card" style="display: none;">
    <canvas id="myChartDois" width="400" height="400"></canvas>
</div>

<script>
    const nomesPermitidos = ${JSON.stringify(nomes || [])};
    const itensLabels = ${JSON.stringify(itens || [])};
    const dadosFalsos = ${JSON.stringify(percFalsas || [])};
    const dadosVerdadeiros = ${JSON.stringify(percVerdadeiras || [])};

    document.addEventListener("DOMContentLoaded", () => {
        const errorCard = document.getElementById("errorCard");
        const graphCard = document.getElementById("graphCard");
        const graphCardDois = document.getElementById("graphCardDois");
        const btn = document.querySelector(".botao");
        const nome = document.getElementById("check");

        // Adiciona um listener para resetar quando o nome é alterado
        nome.addEventListener("input", () => {
            // Oculta os gráficos e o botão
            graphCard.style.display = "none";
            graphCard.classList.remove('show');
            graphCardDois.style.display = "none";
            graphCardDois.classList.remove('show');
            btn.style.display = "none";
            btn.classList.remove('ativo');

            // Oculta o card de erro
            errorCard.style.display = "none";
            errorCard.classList.remove('show');
        });
    });

    function Checagem() {
        const nome = document.getElementById("check").value.trim().toLowerCase();
        const errorCard = document.getElementById("errorCard");
        const graphCard = document.getElementById("graphCard");
        const graphCardDois = document.getElementById("graphCardDois");
        const btn = document.querySelector(".botao");

        if (nomesPermitidos.includes(nome)) {
            errorCard.classList.remove('show');
            errorCard.style.display = "none";

            graphCard.style.display = "block";
            setTimeout(() => {
                graphCard.classList.add('show');
            }, 10);

            exibirGrafico();
        } else {
            errorCard.style.display = "block";
            setTimeout(() => {
                errorCard.classList.add('show');
            }, 10);

            graphCard.style.display = "none";
            graphCard.classList.remove('show');

            graphCardDois.style.display = "none";
            graphCardDois.classList.remove('show');
            btn.style.display = "none";
            btn.classList.remove('ativo');
        }
    }

    function exibirGrafico() {
        const ctx = document.getElementById("myChart").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: itensLabels,
                datasets: [{
                    label: "Meu coração",
                    data: dadosFalsos,
                    backgroundColor: ["#ff6384", "#36a2eb", "#00a80e"],
                    hoverOffset: 3
                }]
            }
        });
        const btn = document.querySelector(".botao");
        btn.style.display = "inline-block"; // Certifique-se de que o botão seja exibido corretamente
        setTimeout(() => {
            btn.classList.add('ativo');
        }, 10); // Garantir a transição suave
    }

    function exibirGraficoDois() {
        const graphCardDois = document.getElementById("graphCardDois");
        graphCardDois.style.display = "block";
        setTimeout(() => {
            graphCardDois.classList.add('show');
        }, 10);

        const ctx = document.getElementById("myChartDois").getContext("2d");
        new Chart(ctx, {
            type: "pie",
            data: {
                labels: itensLabels,
                datasets: [{
                    label: "O verdadeiro coração",
                    data: dadosVerdadeiros,
                    backgroundColor: ["#ff477e", "#ffb84d", "#00c9a7"],
                    hoverOffset: 3
                }]
            }
        });
    }
</script>
</body>
</html>`;
}

function copiarTexto() {
  const output = document.getElementById("htmlPronto");
  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand("copy");

  const message = document.getElementById("copyMessage");
  message.classList.add("show");

  setTimeout(() => {
    message.classList.remove("show");
  }, 2000);
}
