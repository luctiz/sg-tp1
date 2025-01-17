function geometriaNucleoModuloVioleta(puntos_curvatura){

    p_control = [[-1,-0.5,0],[-1,-1,0],[-0.5,-1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_modulo_violeta = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)

    p_control = [[-0.5, -1,0],[0.5,-1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0.5,-1,0],[1,-1,0],[1,-0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[1, -0.5,0],[1,0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)
    

    p_control = [[1,0.5,0],[1,1,0],[0.5,1,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[0.5, 1,0],[-0.5,1,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[-0.5,1,0],[-1,1,0],[-1,0.5,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo_violeta.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo_violeta.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[-1, 0.5,0],[-1,-0.5,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo_violeta.position_list.push(...disc_union_curva.position_list)
    disc_modulo_violeta.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0,0,-1],[0,0,1]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_modulo_violeta, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaNucleoCuerpo(puntos_curvatura){

    p_control = [[-2.5,-0.2,0],[-2.0,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)


    p_control = [[-1.8,0,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[2.0,0,0],[2.5,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma3 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma3.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma3.tang_list)

    
    curva_recorrido = new CurvaCircunferencia(2.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMappingDistanciaRecorrida())
    geometria.agregarColumnasTapas(true)
    return geometria
}

function geometriaNucleoCabeza(puntos_curvatura){

    p_control = [[-1.8,0,0],[0,1,0],[1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,puntos_curvatura)

    
    curva_recorrido = new CurvaCircunferencia(2.0,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMappingDistanciaRecorrida(0,0.5,1,2)) // las texturas en las tapas se podrian mejorar
    geometria.agregarColumnasTapas(true)
    return geometria
}

function geometriaBaseAnillo(){

    p_control = [[-0.5,-0.2,0],[-0.3,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    p_control = [[-0.3,0,0],[0.3,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.3,0,0],[0.5,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma3 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma3.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma3.tang_list)

    
    curva_recorrido = new CurvaCircunferencia(3.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,30)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria

    // p_control = [[-0.5,0,0],[0,0.3,0],[0.5,0,0]]
    // curva_forma = new CurvaBezier(p_control)
    // disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,4)
    
    // curva_recorrido = new CurvaCircunferencia(3.7,[0,0,0])
    // disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    // var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMappingDistanciaRecorrida())
    // geometria.agregarColumnasTapas(true)

    // return geometria
}


function geometriaAnillo(){

    curva_forma = new CurvaCircunferencia(1,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,12)
    
    curva_recorrido = new CurvaCircunferencia(16.8,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,36)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMappingSimple(0,0,1,1,0.10, 10))
}

function geometriaVigaSoporteAnillo(){

    p_control = [[-0.1, -0.05 ,0],[-0.1, 0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)


    p_control = [[-0.1, 0.05 ,0],[0.1, 0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.1, 0.05 ,0],[0.1, -0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[0.1, -0.05 ,0],[-0.1, -0.05, 0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[3.7, 0 ,0],[16,0,0]]
    curva_recorrido = new CurvaBezier(p_control)

    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,30)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)

}

function geometriaTuboVigaAnillo(){

    curva_forma = new CurvaCircunferencia(0.05,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,4)

    p_control = [[-0.4, -0.8 ,0],[0.4,0.8,0]]
    curva_recorrido = new CurvaBezier(p_control)

    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}

function geometriaAnilloAgarreSoporte(cant_modulos,puntos_curvatura){

    let hor_scale = 2.5;
    let ver_scale = 1.2;
    p_control = [[-1*hor_scale,-0.5*ver_scale,0],[-1*hor_scale,-1*ver_scale,0],[-0.5*hor_scale,-1*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_modulo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)

    p_control = [[-0.5*hor_scale, -1*ver_scale,0],[0.5*hor_scale,-1*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[0.5*hor_scale,-1*ver_scale,0],[1*hor_scale,-1*ver_scale,0],[1*hor_scale,-0.5*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[1*hor_scale, -0.5*ver_scale,0],[1*hor_scale,0.5*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)
    

    p_control = [[1*hor_scale,0.5*ver_scale,0],[1*hor_scale,1*ver_scale,0],[0.5*hor_scale,1*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[0.5*hor_scale, 1*ver_scale,0],[-0.5*hor_scale,1*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    p_control = [[-0.5*hor_scale,1*ver_scale,0],[-1*hor_scale,1*ver_scale,0],[-1*hor_scale,0.5*ver_scale,0]]
    curva_cubo = new CurvaBezier(p_control)
    disc_curva_cubo = obtenerDiscretizacionCurvaParametrizada(curva_cubo,puntos_curvatura)
    disc_modulo.position_list.push(...disc_curva_cubo.position_list)
    disc_modulo.tang_list.push(...disc_curva_cubo.tang_list)

    p_control = [[-1*hor_scale, 0.5*ver_scale,0],[-1*hor_scale,-0.5*ver_scale,0]]
    union_curva = new CurvaBezier(p_control)
    disc_union_curva = obtenerDiscretizacionCurvaParametrizada(union_curva,2)
    disc_modulo.position_list.push(...disc_union_curva.position_list)
    disc_modulo.tang_list.push(...disc_union_curva.tang_list)


    curva_recorrido = new CurvaCircunferencia(16.8,[0,0,0],Math.PI/(cant_modulos))
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,7)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_modulo, disc_curva_recorrido, new UVMappingDistanciaRecorrida());
    geometria.agregarFilasTapas(true)
    return geometria
}

function geometriaTuboSoportePaneles(cant_paneles){
    p_control = [[0,0,0],[-5 - 5*cant_paneles,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    
    curva_recorrido = new CurvaCircunferencia(0.5,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,13)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarColumnasTapas()
    return geometria
}

function geometriaTuboFilaPaneles(){
    curva_forma = new CurvaCircunferencia(0.2,[0,0,0])
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,6)

    p_control = [[-10,0,0],[10,0,0]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
    geometria.agregarFilasTapas()
    return geometria
}

function geometriaPanel(){
    grosor_panel = 0.05
    ancho_panel = 2
    largo_panel = 5
    p_control = [[-grosor_panel,ancho_panel,0],[grosor_panel,ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    p_control = [[grosor_panel,ancho_panel,0],[grosor_panel,-ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[grosor_panel,-ancho_panel,0],[-grosor_panel,-ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-grosor_panel,-ancho_panel,0],[-grosor_panel,ancho_panel,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-largo_panel,0,0],[largo_panel,0,0]]
    curva_recorrido = new CurvaBezier(p_control)
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,2)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido,new UVMappingDistanciaRecorrida(0,0,0.5,1.67));//UVMappingSimple(0,0,1,1,2, 2))
    geometria.agregarFilasTapas()
    return geometria
}


function geometriaLuz(size){
    var esfera = new Esfera(size)
    var geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(esfera,7,7)
    return geometria
}

function geometriaCuerpoCapsula(){

    p_control = [[-2.2,-1,0],[-2.0,-0.2,0],[-1.8,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,4)

    p_control = [[-1.8,0,0],[0,0,0],[1.8,-1,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,8)

    //suavizo union de curvas promediando las tangentes en el punto de interseccion de la curva:
    var aux_l = disc_curva_forma.tang_list.length

    var mean_normal = vec3.fromValues(
        disc_curva_forma.tang_list[aux_l-3],
        disc_curva_forma.tang_list[aux_l-2],
        disc_curva_forma.tang_list[aux_l-1])
    vec3.add(mean_normal, mean_normal, vec3.fromValues(
        disc_curva_forma2.tang_list[0],
        disc_curva_forma2.tang_list[1],
        disc_curva_forma2.tang_list[2]))
    vec3.scale(mean_normal,mean_normal,0.5)

    disc_curva_forma.tang_list[aux_l-3] = mean_normal[0]
    disc_curva_forma.tang_list[aux_l-2] = mean_normal[1]
    disc_curva_forma.tang_list[aux_l-1] = mean_normal[2]
    disc_curva_forma2.tang_list[0] = mean_normal[0]
    disc_curva_forma2.tang_list[1] = mean_normal[1]
    disc_curva_forma2.tang_list[2] = mean_normal[2]

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)
    


    curva_recorrido = new CurvaCircunferencia(2.5,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)
    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido, new UVMappingSimple(0,0,1,1,2,4))
    geometria.agregarColumnasTapas()

    return geometria
}

function geometriaCabezaCapsula(){
    p_control = [[1.8,0,0],[2.4,-0.2,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)
    
    curva_recorrido = new CurvaCircunferencia(1.3,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    var geometria = ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido,new UVMappingSimple(0,0,0.4,1,1,4)) //
    geometria.agregarColumnasTapas(true)
    return geometria
}

function geometriaPropulsorCapsula(){

    p_control = [[-2.2,0.01,0],[-2.2,0.31,0],[-4,0.81,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma = obtenerDiscretizacionCurvaParametrizada(curva_forma,10)


    p_control = [[-4,0.81,0],[-4.01,0.8,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)



    p_control = [[-4.01,0.8,0],[-2.21,0.3,0],[-2.21,0,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,10)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)

    p_control = [[-2.21,0,0],[-2.2,0.01,0]]
    curva_forma = new CurvaBezier(p_control)
    disc_curva_forma2 = obtenerDiscretizacionCurvaParametrizada(curva_forma,2)

    disc_curva_forma.position_list.push(...disc_curva_forma2.position_list)
    disc_curva_forma.tang_list.push(...disc_curva_forma2.tang_list)


    
    curva_recorrido = new CurvaCircunferencia(0.3,[0,0,0])
    disc_curva_recorrido = obtenerDiscretizacionCurvaParametrizada(curva_recorrido,20)

    return ModuloGeometria.obtenerGeometriaSuperficieBarrido(disc_curva_forma, disc_curva_recorrido)
}

var camera1;
var camera2;
var camera3;

function mainScene(){

    nodo_principal = new Objeto3D()
        
    // nucleo
    nucleo = new Objeto3D()

    modulo_cuerpo = new Objeto3D()
    geometria = geometriaNucleoCuerpo()
    modulo_cuerpo.setGeometria(geometria)
    modulo_cuerpo.setTexture(textures.modulo_cilindrico, textures.modulo_cilindrico_nm)
    modulo_cuerpo.setMaterialShininess(10.0)
    modulo_cuerpo.addTraslacion(0,0,0)
    nucleo.agregarHijo(modulo_cuerpo)

    modulo_cuerpo2 = new Objeto3D()
    modulo_cuerpo2.setGeometria(geometria)
    modulo_cuerpo2.setTexture(textures.modulo_cilindrico,  textures.modulo_cilindrico_nm)
    modulo_cuerpo2.setMaterialShininess(10.0)
    modulo_cuerpo2.addTraslacion(0,0,-7)
    nucleo.agregarHijo(modulo_cuerpo2)

    color_modulos_cuadrados = [0.2,0.2,0.2]

    modulo_violeta = new Objeto3D()
    geometria = geometriaNucleoModuloVioleta(6)
    modulo_violeta.setGeometria(geometria)
    modulo_violeta.setTexture(textures.createSolidTexture(color_modulos_cuadrados[0],color_modulos_cuadrados[1],color_modulos_cuadrados[2]))
    modulo_violeta.addTraslacion(0,0,3.5)
    nucleo.agregarHijo(modulo_violeta)

    modulo_violeta2 = new Objeto3D()
    modulo_violeta2.setGeometria(geometria)
    modulo_violeta2.setTexture(textures.createSolidTexture(color_modulos_cuadrados[0],color_modulos_cuadrados[1],color_modulos_cuadrados[2]))
    modulo_violeta2.addTraslacion(0,0,-3.5)
    nucleo.agregarHijo(modulo_violeta2)
    nucleo.agregarHijo(modulo_violeta2)

    modulo_cabeza = new Objeto3D()
    geometria = geometriaNucleoCabeza(15)
    modulo_cabeza.setGeometria(geometria)
    modulo_cabeza.setTexture(textures.modulo_esferico, textures.modulo_esferico_nm)
    modulo_cabeza.setMaterialShininess(10.0)
    modulo_cabeza.addTraslacion(0,0,6.3)
    nucleo.agregarHijo(modulo_cabeza)


    //
    // anillo animado
    base_anillo = new Objeto3D()
    geometria = geometriaBaseAnillo()
    base_anillo.setGeometria(geometria)
    base_anillo.setTexture(textures.createSolidTexture(157/255,107/255,73/255))
    base_anillo.addRotacionSegunVariablePorTiempo(Math.PI/5,0,0,1,velocidad_rotacion_anillo)


    // camara 1
    camara_centro = new Objeto3D()
    camara_centro.addTransformacionOrbital(orbitalCam.values)
    nucleo.agregarHijo(camara_centro)
    camera1 = camara_centro;
    //

    color_viga = [0.5,0.5,0.5]
    for (var i = 0; i < cantidad_modulos_anillo; i++){
        var objeto_viga = new Objeto3D()

        var viga_soporte_anillo = new Objeto3D()
        geometria = geometriaVigaSoporteAnillo()
        viga_soporte_anillo.setGeometria(geometria)
        viga_soporte_anillo.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))
        viga_soporte_anillo.addTraslacion(0,0.8,0)
        viga_soporte_anillo.addRotacion(Math.PI*3/4,1,0,0)
        objeto_viga.agregarHijo(viga_soporte_anillo)

        var viga_soporte_anillo2 = new Objeto3D()
        viga_soporte_anillo2.setGeometria(geometria)
        viga_soporte_anillo2.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))
        viga_soporte_anillo2.addTraslacion(0,-0.8,0)
        viga_soporte_anillo2.addRotacion(Math.PI*3/4,1,0,0)
        objeto_viga.agregarHijo(viga_soporte_anillo2)


        //tubos pequeños entre viga
        for (var j = 0; j < 15; j++){
            var tubo_viga = new Objeto3D()
            geometria = geometriaTuboVigaAnillo()
            tubo_viga.setGeometria(geometria)
            tubo_viga.setTexture(textures.createSolidTexture(color_viga[0],color_viga[1],color_viga[2],1))
            tubo_viga.addRotacion(Math.PI*((j % 2)),1,0,0)
            tubo_viga.addTraslacion(j*(0.8)+4,0,0)
            objeto_viga.agregarHijo(tubo_viga)
        }

        var agarre_soporte_anillo = new Objeto3D()
        geometria = geometriaAnilloAgarreSoporte(cantidad_modulos_anillo,3)
        agarre_soporte_anillo.setGeometria(geometria)
        agarre_soporte_anillo.setTexture(textures.modulo_anillo, textures.modulo_anillo_nm)
        agarre_soporte_anillo.setMaterialShininess(10.0)
        agarre_soporte_anillo.addRotacion( (-Math.PI/(2*cantidad_modulos_anillo)),0,0,1)
        objeto_viga.addRotacion((2*i*Math.PI)/(cantidad_modulos_anillo),0,0,1)
        objeto_viga.agregarHijo(agarre_soporte_anillo)
        base_anillo.agregarHijo(objeto_viga)

    }

    var anillo = new Objeto3D()
    geometria = geometriaAnillo()
    anillo.setGeometria(geometria)
    anillo.setTexture(textures.anillo,textures.anillo_nm)
    base_anillo.agregarHijo(anillo)
    nucleo.agregarHijo(base_anillo)

    // tubo con paneles
    color_tubos_paneles = color_modulos_cuadrados

    var tubo_soporte_paneles = new Objeto3D()
    geometria = geometriaTuboSoportePaneles(cantidad_filas_paneles)
    tubo_soporte_paneles.setGeometria(geometria)
    tubo_soporte_paneles.setTexture(textures.createSolidTexture(color_tubos_paneles[0],color_tubos_paneles[1],color_tubos_paneles[2]))
    tubo_soporte_paneles.addTraslacion(0,0,-2.0)
    modulo_cuerpo2.agregarHijo(tubo_soporte_paneles)

    var tubo_paneles;

    for (var i = 0; i < cantidad_filas_paneles; i++){

        tubo_paneles = new Objeto3D()
        geometria = geometriaTuboFilaPaneles()
        tubo_paneles.setGeometria(geometria)
        tubo_paneles.setTexture(textures.createSolidTexture(color_tubos_paneles[0],color_tubos_paneles[1],color_tubos_paneles[2]))
        tubo_paneles.addTraslacion(0,0,-5.0 -5.0 * i)
        tubo_soporte_paneles.agregarHijo(tubo_paneles)

        var panel = new Objeto3D()
        geometria = geometriaPanel()
        panel.setGeometria(geometria)
        panel.setTexture(textures.paneles,textures.paneles_nm)
        panel.setMaterialShininess(50.0);
        panel.addTraslacion(6.5,0.15, 0.15)
        tubo_paneles.agregarHijo(panel)

        var panel = new Objeto3D()
        geometria = geometriaPanel()
        panel.setGeometria(geometria)
        panel.setTexture(textures.paneles,textures.paneles_nm) 

        panel.addTraslacion(-6.5,0.15, 0.15)
        tubo_paneles.agregarHijo(panel)
        tubo_paneles.addRotacionSegunVariable(Math.PI / 180,1,0,0, angulo_paneles)
    }

    nodo_principal.agregarHijo(nucleo)
    // camara 2//
    var camara_paneles = new Objeto3D()
    camara_paneles.addTraslacion(0,0,-5.0 -2.5 * (cantidad_filas_paneles - 1))
    camara_paneles.addTransformacionOrbital(orbitalCam.values)
    tubo_soporte_paneles.agregarHijo(camara_paneles)
    camera2 = camara_paneles
    //


    // fondo 
    // sol
    var sol = new Objeto3D()
    sol.setIluminacionSimple()
    var sup_sol = new Plano(10)
    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(sup_sol, 2, 2)
    sol.setGeometria(geometria)
    sol.setTexture(textures.sol)
    sol.addRotacionSegunVariable(Math.PI / 180,1,0,0, angulo_sol)
    sol.addTraslacion(posicion_sol[0],posicion_sol[1],posicion_sol[2])
    sol.addEscalado(2000,0,2000)
    nodo_principal.agregarHijo(sol)


    // luna

    var luna = new Objeto3D()
    var sup_luna = new Esfera(4)
    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(sup_luna,40,40)
    luna.setGeometria(geometria)
    luna.setTexture(textures.luna,textures.luna_nm)
    luna.setMaterialShininess(5.0);
    luna.addEscalado(2000,2000,2000)
    luna.addTraslacion(12,12, 20)
    luna.addRotacion(Math.PI / 4,0,0,1)
    luna.addRotacion(Math.PI * 0.62,1,0,0)
    nodo_principal.agregarHijo(luna)

    // planeta tierra
    var planeta = new Objeto3D()
    var sup_planeta = new Esfera(15,Math.PI, Math.PI)
    geometria = ModuloGeometria.obtenerGeometriaSuperficieParametrizada(sup_planeta,80,80)
    planeta.setGeometria(geometria)
    planeta.setTexture(textures.tierra)
    planeta.setIluminacionSimple();
    planeta.addEscalado(2000,2000,2000)
    planeta.addRotacion(Math.PI/2,1,0,0)
    planeta.addRotacion(Math.PI*3/2,1,0,0)
    planeta.addTraslacion(0,-16, 0)
    nodo_principal.agregarHijo(planeta)


    // capsula
    var capsula = new Objeto3DControlable()
    capsula.addEscalado(0.5,0.5,0.5)
    capsula.addTraslacion(30,20,30)

    var modelo_capsula = new Objeto3D()
    var cuerpoCapsula = new Objeto3D()
    geometria = geometriaCuerpoCapsula()
    cuerpoCapsula.setGeometria(geometria)
    cuerpoCapsula.setMaterialShininess(10.0)
    cuerpoCapsula.setTexture(textures.capsula,textures.capsula_nm)
    modelo_capsula.agregarHijo(cuerpoCapsula)

    var cabezaCapsula = new Objeto3D()
    geometria = geometriaCabezaCapsula()
    cabezaCapsula.setGeometria(geometria)
    cabezaCapsula.setTexture(textures.capsula)
    cabezaCapsula.setMaterialShininess(10.0)
    modelo_capsula.agregarHijo(cabezaCapsula)

    var propulsorCapsula = new Objeto3D()
    geometria = geometriaPropulsorCapsula()
    propulsorCapsula.setGeometria(geometria)
    propulsorCapsula.setMaterialShininess(20.0)
    propulsorCapsula.setTexture(textures.createSolidTexture(0.30,0.30,0.30,1))
    modelo_capsula.agregarHijo(propulsorCapsula)

    capsula.agregarHijo(modelo_capsula)
    modelo_capsula.addRotacion(Math.PI,0,1,0)

    // camara 3//
    var camera_capsula = new Objeto3D()
    camera_capsula.addRotacion(-Math.PI,0,1,0)
    camera_capsula.addRotacion(Math.PI/6,1,0,0)
    camera_capsula.addTraslacion(0,0,-13)
    capsula.agregarHijo(camera_capsula)
    camera3= camera_capsula;
    //


    var cubo_luz_verde = new Objeto3D()
    geometria = geometriaLuz(0.1)
    cubo_luz_verde.setGeometria(geometria)
    cubo_luz_verde.setTexture(textures.createSolidTexture(0.0,1.0,0.0,1))
    cubo_luz_verde.addTraslacion(-1.7,0,1.5)
    cubo_luz_verde.setIluminacionSimple()
    cubo_luz_verde.setLightPositionUpdater("o1lightPos")
    modelo_capsula.agregarHijo(cubo_luz_verde)

    var cubo_luz_roja = new Objeto3D()
    geometria = geometriaLuz(0.1)
    cubo_luz_roja.setGeometria(geometria)
    cubo_luz_roja.setTexture(textures.createSolidTexture(1.0,0.0,0.0,1))
    cubo_luz_roja.addTraslacion(1.7,0,1.5)
    cubo_luz_roja.setIluminacionSimple()
    cubo_luz_roja.setLightPositionUpdater("o2lightPos")
    modelo_capsula.agregarHijo(cubo_luz_roja)


    var luz_spot = new Objeto3D()
    luz_spot.addTraslacion(0,0,1.5)
    luz_spot.setSpotlightUpdater()
    cabezaCapsula.agregarHijo(luz_spot)

    nodo_principal.agregarHijo(capsula)

    return nodo_principal;
}