function renderizarLista() {
  const lista = document.getElementById("lista")
  lista.innerHTML = ""

  const itens = controlador.getItens()

  itens.forEach((item) => {
    const li = document.createElement("li")
    li.textContent =
      `${item.produto.nome} | Qtd: ${item.quantidade} | R$ ${item.subtotal.toFixed(2)}`
    lista.appendChild(li)
  })

  document.getElementById("total").textContent =
    controlador.getTotal().toFixed(2)
}

function adicionar() {
  const chaveProduto = document.getElementById("produto").value
  const quantidade = document.getElementById("qtd").value

  try {
    controlador.adicionarItem(chaveProduto, quantidade)
    renderizarLista()
    document.getElementById("qtd").value = ""
  } catch (erro) {
    alert(erro.message)
  }
}

function removerUltimo() {
  controlador.removerUltimoItem()
  renderizarLista()
}

function finalizar() {
  if (controlador.getItens().length === 0) {
    alert("Nenhum item no pedido.")
    return
  }

  const totalFinal = controlador.finalizarPedido()
  alert(`Pedido finalizado!\nTotal final: R$ ${totalFinal.toFixed(2)}`)
  renderizarLista()
}
