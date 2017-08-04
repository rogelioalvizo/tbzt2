TireBits = new function(){
    var testMode = true;
    var urlServer = testMode ? '../' : "tirebits.mx/TireBits20"

    var Config = Core.getData("TireBits_Configuracion") || {}
    
    var inicializar = function(){
        Core.setData("TireBits_Configuracion",{})
        //localStorage.setItem("TireBits_Usuarios")
        //localStorage.setItem("TireBits_Usuarios_idx")
        Core.setData("TireBits_Empresas",[])
        Core.setData("TireBits_Empresas_idx",[])
        Core.setData("TireBits_Bases",[])
        Core.setData("TireBits_Bases_idx",[])
        Core.setData("TireBits_Unidades",[])
        Core.setData("TireBits_Unidades_idx",[])
        Core.setData("TireBits_Llantas",[])
        Core.setData("TireBits_Llantas_idx",[])
        Core.setData("TireBits_Mediciones",[])
        Core.setData("TireBits_Mediciones_idx",[])
        Core.setData("TireBits_InitInfo",{lastInit: new Date()})
    }
    
    var guardarConfiguracion = function(){
        Core.setData("TireBits_Configuracion", Config);
    }
    
    if (!Core.getData("TireBits_InitInfo")){
        inicializar()
    }
    
/*    localStorage.getItem("TireBits_Configuracion")
    //localStorage.getItem("TireBits_Usuarios")
    //localStorage.getItem("TireBits_Usuarios_idx")
    localStorage.getItem("TireBits_Empresas")
    localStorage.getItem("TireBits_Empresas_idx")
    localStorage.getItem("TireBits_Bases")
    localStorage.getItem("TireBits_Bases_idx")
    localStorage.getItem("TireBits_Unidades")
    localStorage.getItem("TireBits_Unidades_idx")
    localStorage.getItem("TireBits_Llantas")
    localStorage.getItem("TireBits_Llantas_idx")
    localStorage.getItem("TireBits_Mediciones")
    localStorage.getItem("TireBits_Mediciones_idx")
    */
    
    this.obtenerMarcasVehiculos = function(){
        return Core.request({
            url: urlServer + webMethods.ObtenerMarcasVehiculos,
            data:{}
        })
        .then(function(r){
            let marcas = {}
            rows = r.Result;
            rFields = r.Fields
            for(let row of rows){
                let MarcaID = row[rFields.indexOf("MarcaID")]
                let NombreMarca = row[rFields.indexOf("NombreMarca")]
                marcas[MarcaID] = NombreMarca
            }
            return marcas
        })
        
        //return {abcd:"MarcaMarca1", efgh:"Marca2", ijkl:"Marca3"}
    }
    
    this.obtenerModelosVehiculos = function(){
        return Core.request({
            url: urlServer + webMethods.ObtenerModelosVehiculos,
            data:{}
        })
        .then(function(r){
            let modelos = {}
            rows = r.Result;
            rFields = r.Fields
            for(let row of rows){
                let ModeloID = row[rFields.indexOf("ModeloID")]
                let NombreModelo = row[rFields.indexOf("NombreModelo")]
                modelos[ModeloID] = NombreModelo
            }
            return modelos
        })
        
        //return {abcd:"Modelo1", efgh:"Modelo2", ijkl:"Modelo3"}
    }
    
    
    this.obtenerTiposVehiculos = function(){
        return Core.request({
            url: urlServer + webMethods.ObtenerTiposVehiculos,
            data:{}
        })
        .then(function(r){
            let tipos = {}
            rows = r.Result;
            rFields = r.Fields
            for(let row of rows){
                let TipoID = row[rFields.indexOf("TipoID")]
                let NombreTipo = row[rFields.indexOf("NombreTipo")]
                tipos[TipoID] = NombreTipo
            }
            return tipos
        })
        
        //return {abcd:"Tipo1", efgh:"Tipo2", ijkl:"Tipo3"}
    }
    
    this.Usuarios = {
        ingresar: function(usuario, nip){
            return Core.request({
                url: urlServer + webMethods.Login,
                data: {Usuario:usuario, NIP:nip}
            })
            .then(function(r){
                if (r.Result.length == 0){
                    return false
                }
                let row = r.Result[0];
                let rFields = r.Fields;

                Config.Usuario = usuario;
                Config.Nombre  = row[rFields.indexOf("Nombre")]
                Config.TipoUsuario = row[rFields.indexOf("TipoUsuario")]
                guardarConfiguracion()
                return true
            })
            .catch(function (errorMessage){
                console.log(errorMessage)
                return false
            })
        },
        obtenerAccesoBases: function(){
            return Core.request({
                url: urlServer + webMethods.ObtenerAccesoBases,
                data: {Usuario:Config.Usuario}
            })
            .then(function(r){
                console.log(r)
                let rows = r.Result;
                let rFields = r.Fields;
                
                let Empresas = []
                var ultimaEmpresa = {EmpresaID:""};
                
                for(let row of rows){
                    if (!(row[rFields.indexOf("EmpresaID")] == ultimaEmpresa.EmpresaID)){
                        let Empresa = {
                            EmpresaID: row[rFields.indexOf("EmpresaID")],
                            NombreEmpresa: row[rFields.indexOf("NombreEmpresa")],
                            CorreoElectronico: row[rFields.indexOf("CorreoElectronico")],
                            OtroDato:row[rFields.indexOf("OtroDato")],
                            Bases:[]
                        }
                        Empresas.push(Empresa)
                        ultimaEmpresa = Empresa
                    }
                    let Base = {
                        EmpresaID: row[rFields.indexOf("EmpresaID")],
                        BaseID: row[rFields.indexOf("BaseID")],
                        NombreBase: row[rFields.indexOf("NombreBase")]
                    }
                    ultimaEmpresa.Bases.push(Base)
                }
                
                return Empresas;
            })
            .catch(function (errorMessage){
                console.log(errorMessage)
                return []
            })
        }
    }
    
    this.Empresas = {
        obtener:function(EmpresaID){
            
        }
    }
    
    this.Bases = {
        ingresar:function(EmpresaID, BaseID){
            Config.EmpresaID = EmpresaID
            Config.BaseID = BaseID
            guardarConfiguracion()
        },
        obtener:function(BaseID){
            
        }
    }
    
    this.Vehiculos = {
        listado: function(){
            return Core.request({
                url: urlServer + webMethods.ListadoVehiculos,
                data: {
                    EmpresaID: Config.EmpresaID,
                    BaseID: Config.BaseID
                }
            })
            .then(function(r){
                var Vehiculos = []
                if(r.OK){
                    var rows = r.Result
                    var fields = r.Fields
                    for(let row of rows){
                        var Vehiculo = {}
                        for(let field of fields){
                            Vehiculo[field] = row[fields.indexOf(field)]
                        }
                        Vehiculos.push(Vehiculo)
                    }
                }else{
                    console.log(r.Message)
                }
                return Vehiculos
            })
            .catch(function(msg){
                console.log(msg)
                return []
            })
            /*
            return [
                {VehiculoID: "abcdef", NoEconomico: "D-135", Marca:"BlackFire", Modelo: "GENERAL", Placas:"GALLEGOS"},
                {VehiculoID: "ghijkl", NoEconomico: "D-135", Marca:"BlackFire", Modelo: "GENERAL", Placas:"GALLEGOS"}
            ]
            */
        },
        obtener:function(VehiculoID){
            return Core.request({
                url: urlServer + webMethods.ObtenerVehiculo,
                data: {
                    EmpresaID: Config.EmpresaID,
                    BaseID: Config.BaseID,
                    VehiculoID: VehiculoID
                }
            })
            .then(function(r){
                let vehiculo
                if (r.RowsCount){
                    vehiculo = {}
                    let row = r.Result[0]
                    let fields = r.Fields
                    for (let field of fields){
                        vehiculo[field] = row[fields.indexOf(field)]
                    }
                }
                return vehiculo
            })
            .catch(function(){
                return false  
            })
            /*
            return {
                NoEconomico:"D-135",
                Placas:"",
                Marca:"BlackFire",
                Modelo:"General",
                Año:2017,
                TipoVehiculo:"DOLLY",
                Notas:"Vehiculo de Interflet"
            } 
            */
        },
        guardar: function(vehiculo){
            if(vehiculo.VehiculoID == ""){
                vehiculo.VehiculoID = Core.newId(6)
            }
            vehiculo.EmpresaID = Config.EmpresaID
            vehiculo.BaseID = Config.BaseID
            vehiculo.Usuario = Config.Usuario
            console.log(vehiculo)
            
            return Core.request({
                url: urlServer + webMethods.GuardarVehiculo,
                data: vehiculo
            })
            .then(function(){
                return true
            })
            .catch(function(err){
                console.log(err)
                return false
            })
            
        }
    }
    
    this.Llantas = {
        tbName:"TireBits_Llantas",
        tbIndex:"TireBits_Llantas_idx",
        tbStructure:[
            {field:"LlantaID",  defaultValue:""},
            {field:"TimeStamp", defaultValue:0},
            {field:"Marca",     defaultValue:0},
            {field:"Modelo",    defaultValue:0},
            {field:"Medida",    defaultValue:0}
        ],
        
        obtener:function(LlantaID){
            var dataLlantas = Core.getData(this.tbName)
            for (i in dataLlantas){
                var ll = dataLlantas[i]
                if(ll.LlantaID == LlantaID)
                    return ll;
            }
            //return {data:arrayLlantas, index:indexLlantas}
        },
        
        listado:function(){
            return Core.request({
                url: urlServer + webMethods.ListadoLlantas,
                data: {
                    EmpresaID: Config.EmpresaID,
                    BaseID: Config.BaseID
                }
            })
            .then(function(r){
                var Llantas = []
                if(r.OK){
                    var rows = r.Result
                    var fields = r.Fields
                    for(let row of rows){
                        var Llanta = {}
                        for(let field of fields){
                            Llanta[field] = row[fields.indexOf(field)]
                        }
                        Llantas.push(Llanta)
                    }
                }else{
                    console.log(r.Message)
                }
                return Llantas
            })
            .catch(function(msg){
                console.log(msg)
                return []
            })
            /*
            return [
                {LlantaID: "abcdef", NoEconomico: "10121 IFR", Marca:"Michelin", Modelo: "XZE2", Presion: "100", Profundidad: "12", Ubicacion: "Montada", Lugar: "def"},
                {LlantaID: "ghijkl", NoEconomico: "10190 IFR", Marca:"BlackFire", Modelo: "XZE3", Presion: "95", Profundidad: "12", Ubicacion: "Base"}
            ]
            */
            
        },
        
        insertar:function(llanta){
            var dataLlantas 
            dataLlantas = Core.getData(this.tbName)
            
            llanta.LlantaID = Core.newId()
            llanta.TimeStamp = Core.timeStamp()
            var row = []
            for (var i in this.tbStructure){
                var f = this.tbStructure[i]
                if(llanta[f.field] == undefined || llanta[f.field] == null){
                    row.push(f.defaultValue)
                }else{
                    row.push(llanta[f.field])
                }
            }
            dataLlantas.push(row)
            Core.setData(this.tbName, dataLlantas)
            dataLlantas = null
        }
    }
    
    this.Mediciones = {
        obtener:function(MedicionID){
            
        }
    }
    
}