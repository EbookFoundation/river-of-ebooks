const ACTIONS = {
  set_user: 'set_user',
  set_password: 'set_password',
  set_carousel: 'set_carousel'
}

export default ACTIONS

export const setEmail = email => ({
  type: ACTIONS.set_user,
  data: email
})

export const setPassword = pass => ({
  type: ACTIONS.set_password,
  data: pass
})

export const setCarousel = pos => ({
  type: ACTIONS.set_carousel,
  data: pos
})
