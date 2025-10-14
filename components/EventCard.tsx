import { Colors } from '@/constants/Colors';
import { View } from 'react-native';
import { Card, Icon, Text } from 'react-native-paper';

interface EventCardProps {
  title: string;
  subtitle?: string;
  iconName?: string; // REFERENCE: https://pictogrammers.com/library/mdi/
}

export default function EventCard ({title, subtitle, iconName}: EventCardProps) {
  return(
    <Card mode="contained">
      <Card.Content>
        <View style={{
          display: "flex",
          gap: 15,
          padding: 5,
          flexDirection: "row",
          justifyContent: "center"
        }}>
          {/* Icon div */}
          <View style={{
            justifyContent: "center"
          }}>
            {/* Icon background */}
            <View style={{
              backgroundColor: "white",
              padding: 12,
              borderRadius: "30%"
            }}>
              <Icon
                source={iconName || "account"}
                color={Colors.secondary}
                size={20}
              />
            </View>
          </View>
          {/* Text layout div */}
          <View style={{
            flex: 1,
            justifyContent: "center",
            gap: 5,
          }}>
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: "bold"
              }}>
                {title}
              </Text>
            </View>
            {subtitle && 
              <View>
                <Text style={{
                  fontSize: 14,
                }}>
                  {subtitle}
                </Text>
              </View>
            }
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}