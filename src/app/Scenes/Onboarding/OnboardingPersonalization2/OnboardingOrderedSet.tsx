import { OnboardingOrderedSetQuery } from "__generated__/OnboardingOrderedSetQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty, times } from "lodash"
import { Flex, Join, Spacer, useSpace } from "palette"
import { Suspense } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ArtistListItemNew } from "./ArtistListItem"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

interface OnboardingOrderedSetProps {
  id: string
}

const OnboardingOrderedSet: React.FC<OnboardingOrderedSetProps> = ({ id }) => {
  const { dispatch } = useOnboardingContext()
  const { orderedSets } = useLazyLoadQuery<OnboardingOrderedSetQuery>(
    OnboardingOrderedSetScreenQuery,
    {
      key: id,
    }
  )
  const space = useSpace()

  const orderedSet = orderedSets![0]?.orderedSet

  if (isEmpty(orderedSet)) {
    return null
  }

  const nodes = extractNodes(orderedSet)

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: space(1),
        paddingBottom: 80,
      }}
      data={nodes}
      renderItem={({ item }) => {
        switch (item.__typename) {
          case "Artist":
            return (
              <ArtistListItemNew
                artist={item}
                onFollow={() => {
                  dispatch({ type: "FOLLOW", payload: item.internalID })
                }}
                py={space(1)}
              />
            )
          default:
            return null
        }
      }}
      keyExtractor={(item, index) => {
        switch (item.__typename) {
          case "Artist":
            return item.internalID
        }
        return item.__typename + index
      }}
    />
  )
}

const OnboardingPersonalizationListPlaceholder = () => (
  <ProvidePlaceholderContext>
    <Flex mt={2} testID="OnboardingPersonalizationListPlaceholder">
      <Join separator={<Spacer height={20} />}>
        {times(10).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder />
          </Flex>
        ))}
      </Join>
    </Flex>
  </ProvidePlaceholderContext>
)

export const OnboardingOrderedSetScreen: React.FC<OnboardingOrderedSetProps> = (props) => (
  <Suspense fallback={<OnboardingPersonalizationListPlaceholder />}>
    <OnboardingOrderedSet {...props} />
  </Suspense>
)

const OnboardingOrderedSetScreenQuery = graphql`
  query OnboardingOrderedSetQuery($key: String!) {
    orderedSets(key: $key) {
      orderedSet: orderedItemsConnection(first: 50) {
        edges {
          node {
            __typename
            ... on Artist {
              internalID
              ...ArtistListItemNew_artist
            }
          }
        }
      }
    }
  }
`
