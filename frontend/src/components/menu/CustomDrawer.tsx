import { BASE_URL } from "@/src/constants/api";
import { BaseUser } from "@/src/constants/CommissionTypes";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomDrawerProps = {
    user?: BaseUser;
    isAuthenticated: boolean;
} & any

export default function CustomDrawer(props:CustomDrawerProps) {
    const {top, bottom} = useSafeAreaInsets();
    const { user, isAuthenticated } = props;
    const router = useRouter();

    return (
        <View style={{flex:1}}>
            {isAuthenticated && <TouchableOpacity
                style={{padding:20, flexDirection:'row', gap:25, borderBottomColor:"#AAA", borderBottomWidth:1}}
                onPress={() => {router.push('/profile')}}
            >
                <Image
                    source={
                        user?.imageProfile
                          ? { uri: `${BASE_URL}${atob(user.imageProfile)}` }
                          : undefined
                      }
                    style = {{width:65,height:65, borderRadius:100}}
                />
                <View style={{justifyContent:'center', gap:10}}>
                    <Text style={{fontWeight:'bold'}}>{user?.name ?? "Invitado"}</Text>
                    <Text>@{user?.username ?? 'invitado'}</Text>
                </View>
            </TouchableOpacity>}
            <DrawerContentScrollView {...props} 
                contentContainerStyle={{padding:top}}
            >
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
            {isAuthenticated&&<TouchableOpacity
                style={{
                    borderTopColor: "#AAA",
                    borderTopWidth: 1,
                    padding: 10,
                    paddingBottom: 20 + bottom,
                    paddingTop:15,
                    flexDirection: "row",
                    alignItems: "center"
                }}
                onPress={()=>{router.push('/logout')}}
            >
                <Text style={{fontSize:22}}> 🚪 </Text>
                <Text style={{fontSize:15, fontWeight:500, color:'#777'}}> Logout </Text>
            </TouchableOpacity>}
        </View>
    )
}
