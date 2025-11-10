import { StyleSheet } from 'react-native';

const Variables = StyleSheet.create({

    /********* Header *********/
    header:{
        alignItems: 'center',
        marginTop: '50%',
        marginBottom: '20%',
    },

    /********* Buttons *********/
    buttons: {
        width: '75%',
        borderWidth: 2,
        borderColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 80,
        borderRadius: 15,
        marginBottom: 20,
    },
    buttonsText:{
        fontWeight: 'normal',
        fontSize: 20,
        textAlign: 'center',
    },

    linkContainer:{         //Sign-Up and Login links ONLY 
        flexDirection: 'row',
        gap: 5,
        color: 'white',
        marginTop: '12%',
    },
    underlinedText:{
        color: 'white',
        textDecorationLine: 'underline',  
    },

    /********* Input Style *********/
    inputStyle: {
        width: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 15,
        paddingVertical: 0,
        paddingHorizontal: 5,
        borderColor: 'white',
    },
    input: {
        flex: 1,
        height: 40,
        color: 'white',
    },

    /********* Footer *********/
    footer:{
        position: 'absolute',
        bottom: '7%',
        alignItems: 'center',
        width: '100%',  
    }



});

export default Variables;
