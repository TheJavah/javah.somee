// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en dispositivos/emuladores Ripple o Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Controlar la pausa de Cordova y reanudar eventos
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova se ha cargado. Haga aquí las inicializaciones que necesiten Cordova.

        extractNames();

        $("#enviar").click(function (event) {
            var name = $("#name").val();
            if (name == ''){
                bootbox.alert('Error: Debe introducir un nombre.');
            } else {
                newName(name);
                $("#name").val('');
            }
        });

        /*
        $("#prueba").click(function (event) {
            bootbox.alert("Hello world!", function () { });
            bootbox.confirm("Are you sure?", function (result) {
                bootbox.alert("Confirm result: " + result);
            });
            bootbox.prompt("What is your name?", function (result) {
                if (result === null) {
                    bootbox.alert("Prompt dismissed");
                } else {
                    bootbox.alert("Hi <b>" + result + "</b>");
                }
            });
        });
        */
    };

    function newName(name) {
        $('#myPleaseWait').modal('show');
        var contact = {
            'contact': {
                Nombre: name
            }
        };
        $.ajax({
            url: 'http://xxxx/API/SvcFunctions.svc/CreateContact',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(contact),
            success: function (result) {
                var Info = result.ResultContact.Info;

                if (result.ResultContact.Info.CodError == '00000') {
                    $('#myPleaseWait').modal('hide');
                    bootbox.alert(Info.DescError);
                    extractNames();
                } else {
                    $('#myPleaseWait').modal('hide');
                    bootbox.alert('Error ' + Info.CodError + ': ' + Info.DescError);
                }
            },
            error: function (result) {
                $('#myPleaseWait').modal('hide');
                bootbox.alert('Error: ' + result.status + ' ' + result.statusText);
            }
        });
    }

    
    function deleteName(Id) {
        $('#myPleaseWait').modal('show');
        $.ajax({
            url: 'http://xxxx/API/SvcFunctions.svc/DeleteContact',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: '{"Id":"' + Id + '"}',
            success: function (result) {
                var Info = result.ResultDeleteContact.Info;

                if (result.ResultDeleteContact.Info.CodError == '00000') {
                    $('#myPleaseWait').modal('hide');
                    bootbox.alert(Info.DescError);
                } else {
                    $('#myPleaseWait').modal('hide');
                    bootbox.alert('Error ' + Info.CodError + ': ' + Info.DescError);
                }
            },
            error: function (result) {
                $('#myPleaseWait').modal('hide');
                bootbox.alert('Error: ' + result.status + ' ' + result.statusText);
            }
        });
    }

    function extractNames() {
        $('#myPleaseWait').modal('show');
        $.ajax({
            url: 'http://xxxx/API/SvcFunctions.svc/ListadoNombres',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '',
            success: function (result) {
                if (result.ResultListadoNombres.Info.CodError == '00000') {

                    drawTable(result.ResultListadoNombres.Nombres);

                    $("[id*=NombresTable] td span").click(function (e) {
                        var Id = $(this).closest('tr').children('td:first').text();
                        var Nombre = $(this).closest('tr').children('td').eq(1).text();
                        bootbox.confirm("¿Desea borrar el registro de " + Nombre + "?", function (r) {
                            if (r === true){
                                deleteName(Id);
                                extractNames();
                            }
                        });
                    });
                    $('#myPleaseWait').modal('hide');
                } else {
                    $('#myPleaseWait').modal('hide');
                    bootbox.alert(result.ResultListadoNombres.Info.CodError + ': ' + result.ResultListadoNombres.Info.DescError);
                }
            },
            error: function (result) {
                $('#myPleaseWait').modal('hide');
                bootbox.alert('Error: ' + result.statusText);
            }
        });
    }

    function drawTable(data) {
        $("#NombresTable tr").remove();
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
        $("#NombresTable tr:odd").css("background-color", "lightgray");
    }

    function drawRow(rowData) {
        var row = $("<tr />")
        $("#NombresTable").append(row);
        row.append($('<td>' + rowData.Id + '</td>'));
        row.append($('<td>' + rowData.Nombre + '</td>'));
        row.append($('<td><span class="glyphicon glyphicon-trash"></span></td>'));
    }

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    };

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    };

} )();