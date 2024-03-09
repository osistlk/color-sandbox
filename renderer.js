window.onload = function () {
    let main = document.getElementById('main');
    main.innerHTML = 'Loading...';
    try {
        main.innerHTML = window.nodeProcess.getCpuUsage();
    } catch (e) {
        main.innerHTML = e;
    }
}
