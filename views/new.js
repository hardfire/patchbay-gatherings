const { resolve } = require('mutant')
const getTimezone = require('../lib/get-timezone')
const { initialiseState, emptyState } = require('../lib/form-state')
const Form = require('./component/form')

module.exports = function GatheringNew (opts) {
  const {
    initialState,
    scuttle,
    scuttleBlob,
    blobUrl,
    // suggest,
    // avatar,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  var state = initialiseState(initialState)

  return Form({
    state,
    onCancel,
    publish,
    scuttleBlob,
    blobUrl
  })

  function publish () {
    const { title, description, location, image, day, time, progenitor, mentions } = resolve(state)

    day.setHours(time.getHours())
    day.setMinutes(time.getMinutes())
    const opts = {
      title,
      startDateTime: {
        epoch: Number(day),
        tz: getTimezone()
      }
    }

    if (description) opts.description = description
    if (location) opts.location = location
    if (image) opts.image = image
    if (progenitor) opts.progenitor = progenitor
    if (mentions) opts.mentions = mentions

    scuttle.post(opts, (err, data) => {
      if (err) return console.error(err)

      state.set(emptyState())
      afterPublish(data)
    })
  }
}
