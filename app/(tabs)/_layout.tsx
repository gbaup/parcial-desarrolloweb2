import {Tabs} from 'expo-router';
import React from 'react';
import {Platform} from 'react-native';
import {HapticTab} from '@/components/HapticTab';
import {IconSymbol} from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {AntDesign, Feather} from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({color}) => <Feather name="home" size={24} color="black"/>,
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Crear destino',
                    tabBarIcon: ({color}) => <AntDesign name="pluscircleo" size={24} color="black"/>,
                }}
            />
        </Tabs>
    );
}
