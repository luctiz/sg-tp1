function obtenerDiscretizacionCurvaParametrizada(curva, cantidad_puntos_a_discretizar){
    var position_list = []
    var tang_list = []
    
    let auxn = (cantidad_puntos_a_discretizar -1)
    for (let i = 0; i <= auxn; i++){
        punto = curva.evaluarPunto(i/auxn)
        position_list.push(punto[0])
        position_list.push(punto[1])
        position_list.push(punto[2])

        if (i == 0){
            p0 = punto;
        } else {
            p0 = curva.evaluarPunto((i-0.01)/auxn);
        }
        if (i == 1){
            p1 = punto
        } else {
            p1 = curva.evaluarPunto((i+0.01)/auxn)
        }
        tang_vec = vec3.create()
        vec3.sub(tang_vec,p1,p0)  
        vec3.normalize(tang_vec,tang_vec)
        tang_list.push(tang_vec[0])
        tang_list.push(tang_vec[1])
        tang_list.push(tang_vec[2])
    }

    return {position_list, tang_list}
}

class GeometriaCurva{
    constructor(pos,normal,index){
        this.pos=pos;
        this.normal=normal;
        this.index=index;
    }

    bind(){
        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        var indexBuffer = gl.createBuffer();
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = this.index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW); 

        var vertexBuffer = {webgl_position_buffer,webgl_normal_buffer}//,webgl_uvs_buffer}

        return {
            vertexBuffer,
            indexBuffer,
        }
    }

}

class Geometria{ //geometria superficie
    constructor(pos,normal,tangente, binormal,uv,index, cant_columnas){
        this.pos=pos;
        this.normal=normal;
        this.tangente=tangente;
        this.binormal=binormal;
        this.uv=uv;
        this.index=index;
        this.cant_columnas=cant_columnas


        // calculo centro de masa (para luego verificar que las normales queden apuntando afuera)
        this.centro = [0,0,0];
        var i;
        for (i = 0; i<(this.pos.length); i+=3){
            this.centro[0]+=this.pos[i]
            this.centro[1]+=this.pos[i+1]
            this.centro[2]+=this.pos[i+2]
        }
        this.centro[0]/=(this.pos.length / 3)
        this.centro[1]/=(this.pos.length / 3)
        this.centro[2]/=(this.pos.length / 3)

        this._verificarNormales();
    }

    agregarColumnasTapas(solid_uv = false){
        var rows = (this.pos.length/3)/this.cant_columnas;
        var cols = this.cant_columnas


        //quedarme con las 2 columnas, primera y ultima
        var new_col1 = []
        var new_col2 = []
        for (var i=0; i<rows; i++){
            new_col1.push(...[this.pos[i*cols*3], this.pos[i*cols*3 +1], this.pos[i*cols*3 + 2]])
            new_col2.push(...[this.pos[((i*cols)+cols-1)*3], this.pos[((i*cols)+cols-1)*3 +1], this.pos[((i*cols)+cols-1)*3 + 2]])
        }

        ////// obtener normal tapas
        // asumo que la superficie tiene al menos 3 puntos por fila, de lo contrario crear una pared como fila no tendria sentido.
        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm1 = vec3.create()
        var nm2 = vec3.create()

        var p0 = vec3.fromValues(new_col1[0],new_col1[0+1],new_col1[0+2])
        var p1 = vec3.fromValues(new_col1[0+3],new_col1[0+4],new_col1[0+5])

        var p2 = vec3.fromValues(new_col1[0+6],new_col1[0+7],new_col1[0+8]) 
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_col1[3+6],new_col1[3+7],new_col1[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm1,v0,v1)
        vec3.normalize(nm1,nm1)

        //tomo a v0 como vector tg//
        var tg1 = vec3.create()
        vec3.add(tg1,tg1,v0)
        vec3.normalize(tg1,tg1)


        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm1, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm1,nm1,-1)
        }
        
        /// normal segunda tapa:
        var p0 = vec3.fromValues(new_col2[0],new_col2[0+1],new_col2[0+2])
        var p1 = vec3.fromValues(new_col2[0+3],new_col2[0+4],new_col2[0+5])
        var p2 = vec3.fromValues(new_col2[3+6],new_col2[3+7],new_col2[3+8])
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_col2[3+6],new_col2[3+7],new_col2[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm2,v0,v1)
        vec3.normalize(nm2,nm2)

        //tomo a v0 como vector tg//
        var tg2 = vec3.create()
        vec3.add(tg2,tg2,v0)
        vec3.normalize(tg2,tg2)


        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm2, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm2,nm2,-1)
        }


        //Obtengo binormales//
        var binormal1 = vec3.create()
        vec3.cross(binormal1,tg1,nm1)

        var binormal2 = vec3.create()
        vec3.cross(binormal2,tg2,nm2)
        //


        /////////
        for (var i=0;i<rows; i+=1) {
            this.pos.splice(i*(cols+1)*3,0,...[new_col1[(3*i)],new_col1[(3*i)+1],new_col1[(3*i)+2]])
            this.normal.splice(i*(cols+1)*3,0,...[nm1[0],nm1[1],nm1[2]])
            this.tangente.splice(i*(cols+1)*3,0,...[tg1[0],tg1[1],tg1[2]])
            this.binormal.splice(i*(cols+1)*3,0,...[binormal1[0],binormal1[1],binormal1[2]])
        }
        //  
        
        cols+=1

        for (var i=0;i<rows; i+=1) {
            this.pos.splice( (i*(cols+1) + cols) *3 , 0, ...[new_col2[(3*i)],new_col2[(3*i)+1],new_col2[(3*i)+2]])
            this.normal.splice( (i*(cols+1) + cols) *3 , 0, ...[nm2[0],nm2[1],nm2[2]])
            this.tangente.splice( (i*(cols+1) + cols) *3 , 0, ...[tg2[0],tg2[1],tg2[2]])
            this.binormal.splice( (i*(cols+1) + cols) *3 , 0, ...[binormal2[0],binormal2[1],binormal2[2]])
        }

        // calculo de coordenadas uv 
        //tapa 1:
        var uvlist = obtenerUVsTapa(new_col1, nm1, solid_uv)
        cols-=1
        for (var i=0;i<rows; i+=1) {
            this.uv.splice( i*(cols+1)*2 , 0,...[uvlist[(2*i)],uvlist[(2*i)+1]])
        }
        //  
        //tapa 2:
        var uvlist = obtenerUVsTapa(new_col2, nm2, solid_uv)
        cols+=1

        for (var i=0;i<rows; i+=1) {
            this.uv.splice( (i*(cols+1) + cols) *2 , 0, ...[uvlist[(2*i)],uvlist[(2*i)+1]] )
        }

        //actualizo index
        cols+=1;
        var index=[];
        
        for (var j=2; j<rows-1;j++){
            index.push(0);
            index.push((cols)*(j-1));
            index.push((cols)*j);
        }

        for (var i=0;i<rows-1;i++){
            index.push(i*cols);
            for (var j=1;j<cols-2;j++){ //salteo primer y ultima columna ya que van a ser tapas.
                index.push(i*cols+j);
                index.push((i+1)*cols+j);
                index.push(i*cols+j+1);
                index.push((i+1)*cols+j+1);
            }
            index.push((i+1)*cols+cols-1);
        }

        for (var j=2; j<rows-1;j++){
            index.push(cols-1+0);
            index.push(cols-1+(cols)*(j-1));
            index.push(cols-1+(cols)*j);
        }
        this.index=index;
    }

    agregarFilasTapas(solid_uv = false){ //creo que el parametro suavizar no es necesario en este caso?
        var rows = (this.pos.length/3)/this.cant_columnas;
        var cols = this.cant_columnas
        
        var new_row1= this.pos.slice(0,cols*3)
        var new_row2 = this.pos.slice(cols*3*(rows-1))

        ////// obtener normal tapas
        // asumo que la superficie tiene al menos 3 puntos por fila, de lo contrario crear una pared como fila no tendria sentido.
        var v0 =vec3.create()
        var v1 = vec3.create()
        var nm1 = vec3.create()
        var nm2 = vec3.create()

        var p0 = vec3.fromValues(new_row1[0],new_row1[0+1],new_row1[0+2])
        var p1 = vec3.fromValues(new_row1[0+3],new_row1[0+4],new_row1[0+5])

        var p2 = vec3.fromValues(new_row1[0+6],new_row1[0+7],new_row1[0+8]) 
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_row1[3+6],new_row1[3+7],new_row1[3+8]) // para el de los paneles, ya que uno curvas y en la union los puntos se repiten
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm1,v0,v1)
        vec3.normalize(nm1,nm1)

        //tangente1//
        var tg1 = vec3.create()
        vec3.add(tg1,tg1,v0)
        vec3.normalize(tg1,tg1)


        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm1, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm1,nm1,-1)
        }
        
        //binormal1//
        var binormal1 = vec3.create()
        vec3.cross(binormal1,nm1,tg1)

        /// normal segunda tapa:
        var p0 = vec3.fromValues(new_row2[0],new_row2[0+1],new_row2[0+2])
        var p1 = vec3.fromValues(new_row2[0+3],new_row2[0+4],new_row2[0+5])
        var p2 = vec3.fromValues(new_row2[3+6],new_row2[3+7],new_row2[3+8])
        if (vec3.equals(p1,p2)){
            var p2 = vec3.fromValues(new_row2[3+6],new_row2[3+7],new_row2[3+8])
        }

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(nm2,v0,v1)
        vec3.normalize(nm2,nm2)

        //tangente2//
        var tg2 = vec3.create()
        vec3.add(tg2,tg2,v0)
        vec3.normalize(tg2,tg2)

        //chequeo que la normal no haya quedado apuntando hacia dentro:
        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-p0[0],
            this.centro[1]-p0[1],
            this.centro[2]-p0[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        var x = vec3.dot(nm2, aux_vecdir_to_center)
        if (x > 0) {
            vec3.scale(nm2,nm2,-1)
        }

        //binormal2//
        var binormal2 = vec3.create()
        vec3.cross(binormal2,nm2,tg2)

        /////////
        this.pos.unshift(...new_row1)
        this.pos.push(...new_row2)

        for (var i= 0; i<cols; i++){
            this.normal.unshift(...[nm1[0],nm1[1],nm1[2]])
            this.normal.push(...[nm2[0],nm2[1],nm2[2]])

            this.tangente.unshift(...[tg1[0],tg1[1],tg1[2]])
            this.tangente.push(...[tg2[0],tg2[1],tg2[2]])

            this.binormal.unshift(...[binormal1[0],binormal1[1],binormal1[2]])
            this.binormal.push(...[binormal2[0],binormal2[1],binormal2[2]])
        }


        // calculo de coordenadas uv 
        //tapa 1:
        var uvlist = obtenerUVsTapa(new_row1, nm1, solid_uv)
        this.uv.unshift(...uvlist)

        //tapa 2:
        var uvlist = obtenerUVsTapa(new_row2, nm2, solid_uv)
        this.uv.push(...uvlist)

        //// fin calculo coord uv.

        //actualizo index
        for (var j=0; j<this.index.length;j++){
            this.index[j]+=cols;
        }

        for (var j=0; j<cols-2;j++){
            this.index.unshift(0);
            this.index.unshift(j+1);
            this.index.unshift(j+2);
        }

        for (var j=0; j<cols-2;j++){
            this.index.push(((rows+1)*(cols)));
            this.index.push(((rows+1)*(cols)) +j+1);
            this.index.push(((rows+1)*(cols))+j+2);
        } 
    }

    obtenerGeometriaNormales(){
        // codigo solamente por si se quiere dibujar normales
        var normallines_pos = []
        var normallines_normal = []
        for (var i = 3; i<=(this.pos.length); i+=3){
            normallines_pos.push(this.pos.at(i-3))
            normallines_pos.push(this.pos.at(i-2))
            normallines_pos.push(this.pos.at(i-1))
            normallines_pos.push(this.pos.at(i-3) + this.tangente.at(i-3))
            normallines_pos.push(this.pos.at(i-2) + this.tangente.at(i-2))
            normallines_pos.push(this.pos.at(i-1) + this.tangente.at(i-1))

            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
            normallines_normal.push(1)
        }

        var index=[]
        var cant_puntos = (this.pos.length)

        for (var i = 0; i < (cant_puntos); i+=2){
            index.push(i)
            index.push(i+1)
        }
        
        return new GeometriaCurva(normallines_pos,normallines_normal, index)
    }


    // funcion para corregir normales si quedan apuntando hacia adentro
    _verificarNormales(){
        //veo si la normal del primer punto apunta hacia el centro. Si apunta para el lado contrario entonces invierto todas las normales
        var aux_normal = vec3.fromValues(this.normal[0],this.normal[1],this.normal[2])
        vec3.normalize(aux_normal,aux_normal)

        var aux_vecdir_to_center = vec3.fromValues(
            this.centro[0]-this.pos[0],
            this.centro[1]-this.pos[1],
            this.centro[2]-this.pos[2])
        vec3.normalize(aux_vecdir_to_center,aux_vecdir_to_center)

        // Producto escalar para ver si tienen misma direccion
        var x = vec3.dot(aux_normal, aux_vecdir_to_center)
        if (x > 0) {
            for (var i = 0; i<this.pos.length; i+=1){
                this.normal[i] = -this.normal[i]
            }
        }
        //
    } 

    bind(){
        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.pos), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.pos.length / 3;

        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uv.length / 2;

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normal.length / 3;

        var webgl_tangent_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_tangent_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangente), gl.STATIC_DRAW);
        webgl_tangent_buffer.itemSize = 3;
        webgl_tangent_buffer.numItems = this.tangente.length / 3;

        var webgl_binormal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_binormal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.binormal), gl.STATIC_DRAW);
        webgl_binormal_buffer.itemSize = 3;
        webgl_binormal_buffer.numItems = this.binormal.length / 3;

        var indexBuffer = gl.createBuffer();
        indexBuffer.itemSize = 1;
        indexBuffer.numItems = this.index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index), gl.STATIC_DRAW);  

        var vertexBuffer = {webgl_position_buffer,webgl_normal_buffer,webgl_tangent_buffer,webgl_binormal_buffer,webgl_uvs_buffer}

        return {vertexBuffer, indexBuffer}
    }
}


class ModuloGeometria {
    static obtenerGeometriaSuperficieParametrizada(superficie, filas, columnas, uvmapping = new UVMappingSimple()){
        var vertex = this._getVertexBufferSuperficieParametrizada(superficie,filas,columnas, uvmapping);
        var index = this._getIndexBuffer(filas,columnas)
        return new Geometria(vertex.pos,vertex.normal,vertex.tangente,vertex.binormal,vertex.uv, index,columnas)
    }

    static obtenerGeometriaSuperficieBarrido(forma_discretizada, recorrido_discretizado, uvmapping = new UVMappingSimple()){
        var vertex = this._getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado,uvmapping)
        var columnas = forma_discretizada.position_list.length / 3
        var filas = recorrido_discretizado.position_list.length / 3
        var index = this._getIndexBuffer(filas, columnas)

        return new Geometria(vertex.pos,vertex.normal,vertex.tangente,vertex.binormal,vertex.uvs, index, columnas)
    }

    static _getVertexBufferSuperficieParametrizada(superficie, rows,cols, uvmapping)
        {
            var pos=[];
            var uv = [];
            var normal=[];
            var tangente = []
            var binormal = []

            for (var i=0;i<rows;i++){
                for (var j=0;j<cols;j++){

                    var u=i/(rows-1); 
                    var v=j/(cols-1);

                    var p=superficie.getPosicion(u,v);

                    pos.push(p[0]);
                    pos.push(p[1]);
                    pos.push(p[2]);
                    
                    var n=superficie.getNormal(u,v);

                    normal.push(n[0]);
                    normal.push(n[1]);
                    normal.push(n[2]);

                    var t=superficie.getTangente(u,v);

                    tangente.push(t[0]);
                    tangente.push(t[1]);
                    tangente.push(t[2]);

                    var bn=superficie.getBinormal(u,v);

                    binormal.push(bn[0]);
                    binormal.push(bn[1]);
                    binormal.push(bn[2]);

                    var uvs=superficie.getCoordenadasTextura(u,v);

                    uv.push((uvmapping.start_u + (uvs[0]/uvmapping.u_repeat)*uvmapping.len_u) ) //idem superficie barrido
                    uv.push((uvmapping.start_v + (uvs[1]/uvmapping.v_repeat)*uvmapping.len_v) ) //idem superficie barrido
                }
            }
            return {pos,uv,normal,tangente,binormal}
        }
    static _getIndexBuffer(rows,cols){
        var index=[];

            for (var i=0;i<rows-1;i++){
                index.push(i*cols);
                for (var j=0;j<cols-1;j++){
                    index.push(i*cols+j);
                    index.push((i+1)*cols+j);
                    index.push(i*cols+j+1);
                    index.push((i+1)*cols+j+1);
                }
                index.push((i+1)*cols+cols-1);
            }
            return index;
    }

    static _getVertexBufferSuperficieBarrido(forma_discretizada,recorrido_discretizado, uvmapping){

        var pos = []
        var normal = []
        var tangente = []
        var binormal = []
        var uvs = []

        var p0 = vec3.fromValues(recorrido_discretizado.position_list[0],recorrido_discretizado.position_list[0+1],recorrido_discretizado.position_list[0+2])
        var p1 = vec3.fromValues(recorrido_discretizado.position_list[0+3],recorrido_discretizado.position_list[0+4],recorrido_discretizado.position_list[0+5])
        var p2 = vec3.fromValues(recorrido_discretizado.position_list[0+6],recorrido_discretizado.position_list[0+7],recorrido_discretizado.position_list[0+8])
        if (Number.isNaN(p2[0])){
            p2 = p1;
        }

        var v0 =vec3.create()
        var v1 = vec3.create()
        var vec_nm = vec3.create()
        // asumo que la normal es constante (los puntos de la curva recorrido estan contenidos en un plano)

        vec3.sub(v0,p1,p0)
        vec3.sub(v1,p2,p0)
        vec3.cross(vec_nm,v0,v1)
        if ((vec_nm[0] == 0) & (vec_nm[1] == 0) & (vec_nm[2] == 0)){ // en este caso me quedo con un vector normal cualquiera a la recta
            if (v0[0] != 0) {
                vec_nm = vec3.fromValues((-v0[1]*2 - v0[2]*2)/v0[0], 2, 2)
            } else if (v0[1] != 0){
                vec_nm=  vec3.fromValues(2,(-v0[0]*2 - v0[2]*2)/v0[1],2)
            } else {
                vec_nm=  vec3.fromValues(2,2,(-v0[0]*2 - v0[1]*2)/v0[2])
            }
        }
        vec3.normalize(vec_nm,vec_nm)

        let recorrido_length = recorrido_discretizado.position_list.length
        let forma_length = forma_discretizada.position_list.length


        
        for (var j = 0; j<recorrido_length; j+=3){
            var punto_recorrido = vec3.fromValues(recorrido_discretizado.position_list[j], recorrido_discretizado.position_list[j+1], recorrido_discretizado.position_list[j+2])
            var vec_tg = vec3.fromValues(recorrido_discretizado.tang_list[j],recorrido_discretizado.tang_list[j+1],recorrido_discretizado.tang_list[j+2])
            var vec_binormal = vec3.create()
            vec3.cross(vec_binormal, vec_tg, vec_nm) //producto vectorial entre tangente y normal

            for (var i = 0; i<(forma_length); i+=3){
                var forma_pos = vec3.fromValues(forma_discretizada.position_list[i],forma_discretizada.position_list[i+1],forma_discretizada.position_list[i+2])
                
                var aux1 = vec3.create() 
                var aux2 = vec3.create() 
                var aux3 = vec3.create();

                vec3.scale(aux1, vec_nm, forma_pos[0]) 
                vec3.scale(aux2, vec_binormal,forma_pos[1])
                vec3.scale(aux3, vec_tg, forma_pos[2])

                var new_forma_pos = vec3.create()
                vec3.add(new_forma_pos, new_forma_pos, punto_recorrido)
                vec3.add(new_forma_pos, new_forma_pos, aux1)
                vec3.add(new_forma_pos, new_forma_pos, aux2)
                vec3.add(new_forma_pos, new_forma_pos, aux3)

                pos.push(new_forma_pos[0])
                pos.push(new_forma_pos[1])
                pos.push(new_forma_pos[2])

                var forma_tg = vec3.fromValues(forma_discretizada.tang_list[i],forma_discretizada.tang_list[i+1],forma_discretizada.tang_list[i+2])
                vec3.scale(aux1, vec_nm, forma_tg[0]) 
                vec3.scale(aux2, vec_binormal,forma_tg[1])
                vec3.scale(aux3, vec_tg, forma_tg[2])
                var new_forma_tg = vec3.create()
                vec3.add(new_forma_tg, new_forma_tg, aux1)
                vec3.add(new_forma_tg, new_forma_tg, aux2)
                vec3.add(new_forma_tg, new_forma_tg, aux3)
                var sup_normal = vec3.create()
                vec3.cross(sup_normal, new_forma_tg, vec_tg)
                vec3.normalize(sup_normal,sup_normal)
                normal.push(sup_normal[0])
                normal.push(sup_normal[1])
                normal.push(sup_normal[2])

                tangente.push(vec_tg[0])
                tangente.push(vec_tg[1])
                tangente.push(vec_tg[2])

                var sup_binormal = vec3.create()
                vec3.cross(sup_binormal, vec_tg, sup_normal)
                binormal.push(sup_binormal[0])
                binormal.push(sup_binormal[1])
                binormal.push(sup_binormal[2])
            }
        }
        uvs = uvmapping.mapBarrido(forma_discretizada, recorrido_discretizado);

        return {
            pos,
            normal,
            tangente,
            binormal,
            uvs
        }
    }

    
    static _getIndexBufferTangentesCurvaDiscretizada(position_buffer_length){
        var curve_index=[]

        for (var i = 0; i < position_buffer_length; i++){
            curve_index.push(i)
        }

        var curve_index_buffer = gl.createBuffer();
        curve_index_buffer.itemSize = 1;
        curve_index_buffer.numItems = curve_index.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, curve_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(curve_index), gl.STATIC_DRAW); 

        return curve_index_buffer
    }



    static obtenerGeometriaCurvaParametrizada(curva, cant_puntos){
        var vertexBuffer = this._getVertexBufferCurva(curva,cant_puntos);
        var indexBuffer = this._getIndexBufferCurva(cant_puntos)
        return {vertexBuffer, indexBuffer}
    }


    static obtenerGeometriaTangentesCurvaDiscretizada(curva_discretizada){
        var vertexBuffer = this._getVertexBufferTangentesCurvaDiscretizada(curva_discretizada);
        var indexBuffer = this._getIndexBufferTangentesCurvaDiscretizada(curva_discretizada.position_list.length * 2 / 3)
        return {vertexBuffer, indexBuffer}
    }


    static _getVertexBufferTangentesCurvaDiscretizada(curva_discretizada)
    {
        var new_position_list = []
        var normal_list = []

        for (var i = 0; i < (curva_discretizada.position_list.length / 3); i++){
            var index = i*3

            new_position_list.push(curva_discretizada.position_list[index])
            new_position_list.push(curva_discretizada.position_list[index+1])
            new_position_list.push(curva_discretizada.position_list[index+2])
            
            new_position_list.push(curva_discretizada.position_list[index] +  curva_discretizada.tang_list[index])
            new_position_list.push(curva_discretizada.position_list[index+1] + curva_discretizada.tang_list[index+1])
            new_position_list.push(curva_discretizada.position_list[index+2] + curva_discretizada.tang_list[index+2])

            normal_list.push(1) // normales irrelevantes en este caso
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)
            normal_list.push(1)
        }

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new_position_list), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;


        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal_list), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
        }
    }

    static _getVertexBufferCurvaParametrizada(curva, cant_puntos)
    {
        var discretizacion = obtenerDiscretizacionCurvaParametrizada(curva,cant_puntos)

        var curva_secuencia = discretizacion.position_list
        var tangs_secuencia = discretizacion.tang_list

        var webgl_position_buffer = gl.createBuffer();
        webgl_position_buffer.itemSize = 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curva_secuencia), gl.STATIC_DRAW);

        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangs_secuencia), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
        }
    }
}


function obtenerUVsTapa(tapa_pos, normal, solid_uv){
    if (solid_uv){  
        // caso en el que quiero una tapa de un solo color
        uv_list = []
        for (var i = 0; i<tapa_pos.length; i+=3){
            uv_list.push(...[0,0])
        }
        return uv_list
    }

    // calculo de coordenadas uv tapa 2:
    var a = vec3.fromValues(normal[0],normal[1],normal[2])
    var b = vec3.fromValues(0,0,-1)
    var s = vec3.create()

    vec3.cross(s,a,b) 
    if (vec3.equals(s,vec3.fromValues(0,0,0))){
        s = vec3.fromValues(1,0,0)
    }
    vec3.normalize(s,s) // obtengo eje de rotacion para alinear plano al eje z

    var c = Math.acos(vec3.dot(a,b))

    var rotmat = mat4.create()
    mat4.fromRotation(rotmat, c, s)

    //
    var a = vec3.fromValues(normal[0],normal[1],normal[2])
    var b = vec3.fromValues(1,0,0) // podria ser (0,1,0) tambien, si se quiere rotar el mapeo 90º
    var s = vec3.create()
    vec3.cross(s,a,b) 
    if (vec3.equals(s,vec3.fromValues(0,0,0))){
        s = vec3.fromValues(0,0,1)
    }
    vec3.normalize(s,s) // obtengo eje de rotacion para alinear plano al eje y

    var c = Math.acos(vec3.dot(a,b))
    var rotmat2 = mat4.create()
    mat4.fromRotation(rotmat2, c, s)

    mat4.multiply(rotmat,rotmat2,rotmat)
    // esto es un parche y capaz no siempre funcione bien?
    if (vec3.equals(normal, vec3.fromValues(0,0,1))){
        mat4.identity(rotmat)
    } else if (vec3.equals(normal, vec3.fromValues(0,0,-1))){
        mat4.fromScaling(rotmat,vec3.fromValues(1,1,-1))
    }
    //

    var xmax = -800000
    var ymax = -800000
    var xmin = 800000
    var ymin = 800000
    var aux = vec3.create()

    for (var i = 0; i < tapa_pos.length; i+=3){
        vec3.transformMat4(aux,vec3.fromValues(tapa_pos[i],tapa_pos[i+1],tapa_pos[i+2]),rotmat)
        if (aux[0] > xmax) { xmax = aux[0]}
        if (aux[1] > ymax) { ymax = aux[1]}
        if (aux[0] < xmin) { xmin = aux[0]}
        if (aux[1] < ymin) { ymin = aux[1]}
    }


    var uv_list = []

    for (var i = 0; i<tapa_pos.length; i+=3){
        vec3.transformMat4(aux,vec3.fromValues(tapa_pos[i],tapa_pos[i+1],tapa_pos[i+2]),rotmat)
        //console.log(`${[new_row2[i].toFixed(5),new_row2[i+1].toFixed(5),new_row2[i+2].toFixed(5)]} \n=> ${[aux[0].toFixed(5), aux[1].toFixed(5), aux[2].toFixed(5)]}`)
        uv_list.push(...[(aux[0] - xmin)/(xmax-xmin),(aux[1] - ymin)/(ymax-ymin)])
    }
    
    return uv_list
}