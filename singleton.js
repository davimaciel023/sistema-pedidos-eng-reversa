class ControladorPedido {
  constructor() {
    if (ControladorPedido._instancia) {
      return ControladorPedido._instancia
    }

    this.pedido = new Pedido()
    ControladorPedido._instancia = this
  }

  static getInstance() {
    if (!ControladorPedido._instancia) {
      new ControladorPedido()
    }
    return ControladorPedido._instancia
  }

  adicionarItem(chaveProduto, quantidade) {
    const item = ItemPedidoFactory.criar(chaveProduto, quantidade)
    this.pedido.adicionarItem(item)
    this._persistirTotal()
    return item
  }

  removerUltimoItem() {
    this.pedido.removerUltimoItem()
    this._persistirTotal()
  }

  getItens() {
    return this.pedido.itens
  }

  getTotal() {
    return this.pedido.calcularTotal()
  }

  finalizarPedido() {
    const totalFinal = this.pedido.calcularTotalFinal()
    localStorage.setItem("ultimoPedido", totalFinal)
    this.pedido.limpar()
    this._persistirTotal()
    return totalFinal
  }

  _persistirTotal() {
    localStorage.setItem("total", this.pedido.calcularTotal())
  }
}

ControladorPedido._instancia = null
