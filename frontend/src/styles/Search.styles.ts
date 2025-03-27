import { StyleSheet } from 'react-native';

export const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1, 
    paddingBottom: 16, 
  },
  topSection: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  topSectionText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Merriweather-Bold",
    paddingLeft: 26,
  },
  input: {
    backgroundColor: '#F4F4F2',
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  worksScrollContainer: {
    marginTop: 10,
  },

  cardWrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 280, // Height of each card
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  artist: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
  },
  sectionWrapper: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Merriweather-Bold",
    paddingLeft: 26,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },

  // Artist Section Styles
  artistsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  artistCardWrapper: {
    width: "48%", // Adapt the size according to screen width
    marginBottom: 10,
  },
  artistCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  artistImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  artistTextContainer: {
    padding: 10,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  scrollContent: {
    padding: 10,
  },

});
