document.addEventListener('DOMContentLoaded', function () {
    const generate = document.getElementById("generate");
    const copyButton = document.getElementById('copyButton');

    generate.addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const maxDigits = parseInt(document.getElementById("maxDigits").value);
        const cantPasswords = parseInt(document.getElementById("cantPasswords").value);
        const specialChars = document.getElementById("specialChars").checked;
        const minusculas = document.getElementById("minusculas").checked;
        const mayusculas = document.getElementById("mayusculas").checked;
        const numeros = document.getElementById("numeros").checked;
        const sinSucesiones = document.getElementById("sinSucesiones").checked;
        const noConsecutivos = document.getElementById("noConsecutivos").checked;

        
        let passwords = [];
        let errorMessages = [];

        // Validaciones
        if (isNaN(maxDigits) || maxDigits <= 0) {
            errorMessages.push("La longitud de la conytaseña debe ser mayor a 0.");
        }

        if (maxDigits > 30) {
            errorMessages.push("La cantidad máxima de caracteres es 30");
        }

        if (isNaN(cantPasswords) || cantPasswords <= 0 || cantPasswords > 30) {
            errorMessages.push("La cantidad de contraseñas debe ser un número entre 1 y 30.");
        }
        if(!specialChars && !minusculas && !mayusculas && !numeros) {
            errorMessages.push("Seleccione al menos un conjunto de caracteres para generar la contraseña.");
        }

        if (errorMessages.length > 0) {
            // Mostrar mensajes de error
            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.innerHTML = errorMessages.join("<br>");
            errorMessageDiv.style.display = 'block';
        } else {
            // Ocultar mensajes de error
            document.getElementById('error-message').style.display = 'none';

            // Generar contraseñas
            for (let i = 0; i < cantPasswords; i++) {
                let password;
                do {
                    password = passGenerator(maxDigits, specialChars, minusculas, mayusculas, numeros);
                } while (!verifyPasswordChars(password, specialChars, minusculas, mayusculas, numeros, sinSucesiones, noConsecutivos));
                if (i<9){
                    passwords.push(`N° 0${i + 1}: ${password}`);
                }
                else{
                    passwords.push(`N° ${i + 1}: ${password}`);
                }
            }
            const generatedPassId = document.getElementById('generatedPassId');
            const generatedPass = document.getElementById('generatedPass');
            generatedPassId.innerHTML = ''; // Limpiar contenido anterior de ID
            generatedPass.innerHTML = ''; // Limpiar contenido anterior de contraseña

            i = 0; // Inicializar el índice para el typewriter
            typeWriter(passwords, generatedPassId, generatedPass); // Iniciar la animación de máquina de escribir
                copyButton.disabled = false;
        }
    });

    function passGenerator(maxDigits, hasSpecialChars, hasLowerCase, hasUpperCase, hasNumber) {
        let pass = '';
        let chars = createCharset(hasSpecialChars, hasLowerCase, hasUpperCase, hasNumber);

        for (let i = 0; i < maxDigits; i++) {
            const passChar = chars[Math.floor(Math.random() * chars.length)];
            pass += passChar;
        }
        
        return pass;
    }

    function createCharset(hasSpecialChars, hasLowerCase, hasUpperCase, hasNumber) {
        let chars = '';
        if (hasSpecialChars) {
            //chars += '@#+*-&$'; original, recordar modificar el regex
            chars += '/*-.$!'; //modificado
        }
        if (hasLowerCase) {
            chars += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (hasUpperCase) {
            chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (hasNumber) {
            chars += '0123456789';
        }
        return chars;
    }

    function verifyPasswordChars(password, hasSpecialChars, hasLowerCase, hasUpperCase, hasNumber, hasNotSequence, hasNonConsecutive) {
        if (hasSpecialChars && !/[/*-.$!]/.test(password)) {
            return false;
        }
        if (hasLowerCase && !/[a-z]/.test(password)) {
            return false;
        }
        if (hasUpperCase && !/[A-Z]/.test(password)) {
            return false;
        }
        if (hasNumber && !/[0-9]/.test(password)) {
            return false;
        }
        // Verificar caracteres consecutivos y repetidos
        if (hasNotSequence){
            for (let i = 0; i < password.length - 1; i++) {
                if ((password.charCodeAt(i) + 1 === password.charCodeAt(i + 1)) || (password.charCodeAt(i) -1 === password.charCodeAt(i + 1))) {
                    return false;
                }
                
            }
        }
        if (hasNonConsecutive){
            for (let i = 0; i < password.length - 1; i++) {
                if (password.charAt(i) === password.charAt(i + 1)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    let i = 0;
    let timeoutId;

    function typeWriter(passwords, idElement, passElement) {
        if (i < passwords.length) {
            const currentPassword = passwords[i];
            const [idText, passText] = currentPassword.split(': ');
            idElement.innerHTML += idText + '<br>';
            passElement.innerHTML += passText + '<br>';
            i++;
            timeoutId = setTimeout(typeWriter, 50, passwords, idElement, passElement);
        } else {
            clearTimeout(timeoutId);
        }
    }

    function textCopy(elementId) {
        const aux = document.createElement('textarea');
        aux.value = document.getElementById(elementId).innerText;
        document.body.appendChild(aux);
        aux.select();
        document.execCommand('copy');
        document.body.removeChild(aux);
    }

    // Event listener para el botón de copiar
    copyButton.addEventListener('click', function () {
        textCopy('generatedPass');
    });
});