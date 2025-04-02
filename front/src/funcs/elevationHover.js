export const elevationHover = {
    beforeMount(el) {
        let originalElevation = null
        let isButtonDisabled = null
        const onMouseEnter = () => {            
            originalElevation = [...el.classList].find(elem => /^elevation-\d+$/.test(elem))
            isButtonDisabled = [...el.classList].find(elem => elem === 'button-disabled')            
            if (originalElevation && !isButtonDisabled) {                
                el.classList.remove(originalElevation)
                el.classList.add('elevation-0')
            }            
        }

        const onMouseLeave = () => {
            el.classList.remove('elevation-0')
            if (originalElevation) {
                el.classList.add(originalElevation)
            }
        }

        el.addEventListener('mouseenter', onMouseEnter)
        el.addEventListener('mouseleave', onMouseLeave)
        
        el._onMouseEnter = onMouseEnter
        el._onMouseLeave = onMouseLeave
    },
    unmounted(el) {
        el.removeEventListener('mouseenter', el._onMouseEnter)
        el.removeEventListener('mouseleave', el._onMouseLeave)
        delete el._onMouseEnter
        delete el._onMouseLeave
    }
}