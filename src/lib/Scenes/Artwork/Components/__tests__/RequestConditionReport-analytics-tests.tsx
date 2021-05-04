import { RequestConditionReport_artwork } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me } from "__generated__/RequestConditionReport_me.graphql"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { postEventToProviders } from "lib/utils/track/providers"
import { Button } from "palette"
import React from "react"
import { RequestConditionReport } from "../RequestConditionReport"

const artwork: RequestConditionReport_artwork = {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  " $refType": null,
  internalID: "some-internal-id",
  slug: "pablo-picasso-guernica",
  saleArtwork: {
    internalID: "some-sale-internal-id",
  },
}
const me: RequestConditionReport_me = {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  " $refType": null,
  email: "someemail@testerino.net",
  internalID: "some-id",
}

beforeEach(jest.resetAllMocks)

it("tracks request condition report tapped", () => {
  const RequestConditionReportTracking = () => (
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    <RequestConditionReport artwork={artwork} me={me} relay={null} />
  )
  const requestConditionReportComponent = mount(<RequestConditionReportTracking />)

  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()
  expect(postEventToProviders).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "tap",
    context_module: "ArtworkDetails",
  })
})

it("tracks request condition report success", async () => {
  const RequestConditionReportTracking = () => (
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    <RequestConditionReport artwork={artwork} me={me} relay={null} />
  )
  const trackingComponent = mount(<RequestConditionReportTracking />)

  const requestConditionReportComponent = trackingComponent.find("RequestConditionReport")
  requestConditionReportComponent.instance().requestConditionReport = jest
    .fn()
    .mockReturnValue(Promise.resolve({ requestConditionReport: true }))
  requestConditionReportComponent.update()
  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()

  await flushPromiseQueue()

  expect(postEventToProviders).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "success",
    context_module: "ArtworkDetails",
  })
})

it("tracks request condition report failure", async () => {
  const RequestConditionReportTracking = () => (
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    <RequestConditionReport artwork={artwork} me={me} relay={null} />
  )
  const trackingComponent = mount(<RequestConditionReportTracking />)

  const requestConditionReportComponent = trackingComponent.find("RequestConditionReport")
  requestConditionReportComponent.instance().requestConditionReport = jest.fn().mockReturnValue(Promise.reject())
  requestConditionReportComponent.update()
  const requestReportButton = requestConditionReportComponent.find(Button).at(0)
  requestReportButton.props().onPress()

  await flushPromiseQueue()

  expect(postEventToProviders).toBeCalledWith({
    action_name: "requestConditionReport",
    action_type: "fail",
    context_module: "ArtworkDetails",
  })
})
