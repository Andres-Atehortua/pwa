class Camara {
  constructor(videoNode) {
    this.videoNode = videoNode;
  }

  on() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { width: 300, height: 300 },
      })
      .then((stream) => {
        this.videoNode.srcObject = stream;
        this.stream = stream;
      });
  }

  off() {
    this.videoNode.pause();
    this.stream && this.stream.getTracks()[0].stop();
  }

  takePhoto() {
    // Crear canvas para renderizar la imagen
    let canvas = document.createElement('canvas');
    //Colocar medidas del mismo tamaño que el video
    canvas.setAttribute('width', 300);
    canvas.setAttribute('height', 300);

    // Obtener contexto del canvas
    let context = canvas.getContext('2d'); // una imágen

    // Dibujar la imagen dentro del canvas
    context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

    this.photo = context.canvas.toDataURL();

    // Limpiamos todo

    canvas = null;
    context = null;

    return this.photo;
  }
}
