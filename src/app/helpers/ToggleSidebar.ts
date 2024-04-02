const ToggleSidebar = () => {
    const doc = document.querySelector('.sidebar');
    doc?.classList.toggle('opened');
}

export default ToggleSidebar