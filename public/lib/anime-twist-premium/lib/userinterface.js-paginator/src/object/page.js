/**
 * @param  {number} index  [description]
 * @param  {number} numero [description]
 */
Paginator.Page = function(index, numero) {
	this.index = index
	this.numero = numero
	this.items = []
}