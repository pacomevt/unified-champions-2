
export const scrollPercent = (container) => {
    return (scrollY - container.offsetTop) / container.getBoundingClientRect().height;
}


export const displayAt = ({elem : e, container: c, start: x, end: y}) => {
    const scroll = scrollPercent(c);
    return (scroll >= x) && (scroll <= y) ? e.classList.add('-is-visible') : e.classList.remove('-is-visible');
}