#include "modmul.h"
#define BYTE_TO_BINARY_PATTERN "%c%c%c%c%c%c%c%c"
#define BYTE_TO_BINARY(byte)  \
  (byte & 0x80 ? '1' : '0'), \
  (byte & 0x40 ? '1' : '0'), \
  (byte & 0x20 ? '1' : '0'), \
  (byte & 0x10 ? '1' : '0'), \
  (byte & 0x08 ? '1' : '0'), \
  (byte & 0x04 ? '1' : '0'), \
  (byte & 0x02 ? '1' : '0'), \
  (byte & 0x01 ? '1' : '0')
#define BITS_PER_LIMB 64
#define LOG2_BITS_PER_LIMB 6
#define WINDOW_SIZE 4
mpz_t BASE64;

/*  CRT[x], 
    Montgomery[x] 
    Sliding Window[x]
    PseudoRandom Generator[x]*/

typedef struct m_mpz_k{
    int k;
    int num_digits;
    int num_limbs;
    int num_bits_per_limb;
    uint64_t* limbs;
} m_mpz_k;

struct m_mpz_k* setMpzK(int k, int t_num_limbs, int t_bits_per_limb){
    m_mpz_k* base_k = malloc(sizeof(m_mpz_k));
    base_k->k = k;
    base_k->num_bits_per_limb = t_bits_per_limb;
    base_k->num_limbs = t_num_limbs;    
    base_k->limbs = malloc(sizeof(uint64_t)*t_num_limbs);
    base_k->num_digits = -1;
    return base_k;
}

struct m_mpz_k* recode(mpz_t e, mpz_t base, int k){

    int num_limbs = e->_mp_size;
    int new_bits_per_limb = BITS_PER_LIMB/k;
    int new_num_limbs = num_limbs * new_bits_per_limb; 

    m_mpz_k* my_mpz = setMpzK(k, new_num_limbs, new_bits_per_limb);
    
    int new_num_digits;
    mpz_t e_remainder;
    mpz_t e_div;
    mpz_t e_prime;
    mpz_init(e_prime);
    mpz_init(e_remainder);
    mpz_init(e_div);
    mpz_set(e_prime, e); 
    for(new_num_digits = 0; mpz_cmp_ui(e, 0) != 0; new_num_digits++){
        mpz_tdiv_qr(e_div, e_remainder, e, base);
        my_mpz->limbs[new_num_digits] = mpz_get_ui(e_remainder);
        mpz_set(e, e_div);
    }

    my_mpz->num_digits = new_num_digits;
    mpz_set(e, e_prime);

    return my_mpz;
}

void toUpper(char* buffer, mpz_t value){
    char *s = buffer;
    while (*s) {
        *s = toupper((unsigned char) *s);
        s++;
    }
    printf("%s\n", buffer);
}

void modExpSliding(mpz_t r, mpz_t m, mpz_t e, mpz_t N){

    uint8_t  k = 4;
    uint64_t m_2POWk = 1 << (k - 1);

    mpz_t T[m_2POWk];
    mpz_init(T[0]);
    mpz_mod(T[0], m, N); 

    mpz_t msqr;
    mpz_init(msqr);
    mpz_mul(msqr, m, m);
    mpz_mod(msqr, msqr, N);
    for(int i = 1; i < m_2POWk; i++) {
        mpz_init(T[i]);
        mpz_mul (T[i], T[i-1], msqr);
        mpz_mod (T[i], T[i], N);
    }
    mpz_set_ui(r, 1);
    int l =  mpz_size(e) * BITS_PER_LIMB - 1, 
        i =  mpz_size(e) * BITS_PER_LIMB - 1, 
        u = 0;
    do{
        u = 0;
        if(mpz_tstbit(e, i) == 0){
            l = i;
        }
        else{
            l = ((i - k + 1) > 0) ? (i - k + 1) : 0;
            while(!mpz_tstbit(e,l)) {
                l++;
            }
            int qq = l, counter = 1;
            while(qq <= i){
                if(mpz_tstbit(e, qq)) {
                    u += counter;
                }
                qq++;
                counter <<= 1;
            }
        }
        mpz_powm_ui(r, r, (1 << (i - l + 1)), N);
        if(u > 0){
            mpz_mul(r, r, T[(u-1)/2]);
            mpz_mod(r, r, N);
        }
    }while((i = l - 1) >= 0);
    
}

void stage1() {
    char N_hexString[500], e_hexString[500], m_hexString[500]; 
    mpz_t r, N, e, m;
    mpz_inits(r, N, e, m, NULL);
    mpz_set_ui(r, 1);
    if(scanf("%s", N_hexString)){
        mpz_set_str(N, N_hexString, 16);
    } else return;
    if(scanf("%s", e_hexString)){
        mpz_set_str(e, e_hexString, 16);
    } else return;
    if(scanf("%s", m_hexString)){
        mpz_set_str(m, m_hexString, 16);
    } else return;
    modExpSliding(r, m, e, N);
    toUpper(m_hexString, r);
}

void CRT(mpz_t c,mpz_t i_q,mpz_t i_p,mpz_t d_q,mpz_t d_p,mpz_t q, mpz_t p,mpz_t d,mpz_t N,mpz_t m)
{
    mpz_t p_bar, q_bar, one, p_monty, w_monty, psqr_monty;
    mpz_inits(p_bar, q_bar, NULL);
    modExpSliding(p_bar, c, d_p, p);
    modExpSliding(q_bar, c, d_q, q);
    mpz_init_set_ui(one, 1);

    montInit_P_W_PSQR(p_monty, w_monty, psqr_monty, N, BASE64);
    montMul(p_bar, p_bar, psqr_monty, BASE64, N, w_monty);
    montMul(q_bar, q_bar, psqr_monty, BASE64, N, w_monty);
    montMul(q, q, psqr_monty, BASE64, N, w_monty);
    montMul(p, p, psqr_monty, BASE64, N, w_monty);
    montMul(i_q, i_q, psqr_monty, BASE64, N, w_monty);
    montMul(i_p, i_p, psqr_monty, BASE64, N, w_monty);

    montMul(p_bar, p_bar, q, BASE64, N, w_monty);
    montMul(p_bar, p_bar, i_q, BASE64, N, w_monty);
    montMul(q_bar, q_bar, p, BASE64, N, w_monty);
    montMul(q_bar, q_bar, i_p, BASE64, N, w_monty);

    montMul(p_bar, p_bar, one, BASE64, N, w_monty);
    montMul(q_bar, q_bar, one, BASE64, N, w_monty);

    mpz_add(m, p_bar, q_bar);
    mpz_mod(m, m, N);

}

void stage2() {
    char N_hexString[500], d_hexString[500], p_hexString[500], 
         q_hexString[500], dp_hexString[500], dq_hexString[500],
         ip_hexString[500], iq_hexString[500], c_hexString[500];
    
    mpz_t       N, d, p, q, dp, dq, ip, iq, c,  p_prime, q_prime, m;
    mpz_inits(  N, d, p, q, dp, dq, ip, iq, c,  p_prime, q_prime, m, NULL);
    
    if(fgets(N_hexString, 500, stdin)){
        mpz_set_str(N, N_hexString, 16);
    } else return;
    if(fgets(d_hexString, 500, stdin)){
        mpz_set_str(d, d_hexString, 16);
    } else return;
    if(fgets(p_hexString, 500, stdin)){
        mpz_set_str(p, p_hexString, 16);
    } else return;
    if(fgets(q_hexString, 500, stdin)){
        mpz_set_str(q, q_hexString, 16);
    } else return;
    if(fgets(dp_hexString, 500, stdin)){
        mpz_set_str(dp, dp_hexString, 16);
    } else return;
    if(fgets(dq_hexString, 500, stdin)){
        mpz_set_str(dq, dq_hexString, 16);
    } else return;
    if(fgets(ip_hexString, 500, stdin)){
        mpz_set_str(ip, ip_hexString, 16);
    } else return;
    if(fgets(iq_hexString, 500, stdin)){
        mpz_set_str(iq, iq_hexString, 16);
    } else return;
    if(fgets(c_hexString, 500, stdin)){
        mpz_set_str(c, c_hexString, 16);
    } else return;
    CRT(c, iq, ip, dq, dp, q, p, d, N, m);



    gmp_printf("%Zx\n", m);
}

void elgamalEncrypt(mpz_t c1, mpz_t c2, mpz_t r, mpz_t p, mpz_t q, mpz_t g, mpz_t h, mpz_t m){

    mpz_t EPH_KEY;
    mpz_inits(EPH_KEY, NULL);
    gmp_randstate_t state;
    gmp_randinit_default(state);
    uint32_t seed_uint[100];

    BBS_STATE* bbs_state = malloc(sizeof(BBS_STATE));
    mpz_inits(bbs_state->N, bbs_state->s0, NULL);

    bbs_seed(bbs_state, 256);
    bbs_update(bbs_state);
    
    mpz_set_ui(EPH_KEY, 1);
    mpz_fdiv_r(EPH_KEY, bbs_state->s0, q);
    modExpSliding(c1, g, bbs_state->N, p);
    modExpSliding(c2, h, bbs_state->N, p);
    mpz_mul(c2, m, c2);
    mpz_tdiv_r(c2, c2, p);
}

void stage3() {
    char p_hexString[500], q_hexString[500], g_hexString[500], h_hexString[500], m_hexString[500];
    mpz_t p, q, g, h, m; 
    mpz_inits(p, q, g, h, m, NULL);
    if(fgets(p_hexString, 500, stdin)){
        mpz_set_str(p, p_hexString, 16);
    } else return;
    if(fgets(q_hexString, 500, stdin)){
        mpz_set_str(q, q_hexString, 16);
    } else return;
    if(fgets(g_hexString, 500, stdin)){
        mpz_set_str(g, g_hexString, 16);
    } else return;
    if(fgets(h_hexString, 500, stdin)){
        mpz_set_str(h, h_hexString, 16);
    } else return;
    if(fgets(m_hexString, 500, stdin)){
        mpz_set_str(m, m_hexString, 16);
    } else return;
    mpz_t c1, c2, r;
    mpz_init(c1); mpz_init(c2); mpz_init(r);

    elgamalEncrypt(c1, c2, r, p, q, g, h, m);

    gmp_printf("%Zx\n%Zx\n", c1, c2);
}

void elgamalDecrypt(mpz_t m, mpz_t p, mpz_t q, mpz_t g, mpz_t x, mpz_t c1, mpz_t c2){
    mpz_t c1POWx, inv_c1;
    mpz_inits(c1POWx, inv_c1, NULL);
    modExpSliding(c1POWx, c1, x, p);
    mpz_invert(inv_c1, c1POWx, p);
    mpz_mul(m, c2, inv_c1);
    mpz_mod(m, m, p);
}

void stage4() {
    char p_hexString[500], q_hexString[500], g_hexString[500], 
        x_hexString[500], c1_hexString[500], c2_hexString[500];
    mpz_t p, q, g, x, c1, c2; 
    mpz_inits(p, q, g, x, c1, c2, NULL);

    if(fgets(p_hexString, 500, stdin)){
        mpz_set_str(p, p_hexString, 16);
    } else return;
    if(fgets(q_hexString, 500, stdin)){
        mpz_set_str(q, q_hexString, 16);
    } else return;
    if(fgets(g_hexString, 500, stdin)){
        mpz_set_str(g, g_hexString, 16);
    } else return;
    if(fgets(x_hexString, 500, stdin)){
        mpz_set_str(x, x_hexString, 16);
    } else return;
    if(fgets(c1_hexString, 500, stdin)){
        mpz_set_str(c1, c1_hexString, 16);
    } else return;
    if(fgets(c2_hexString, 500, stdin)){
        mpz_set_str(c2, c2_hexString, 16);
    } else return;
    mpz_t m; mpz_init(m);
    elgamalDecrypt(m, p, q, g, x, c1, c2);
   
    gmp_printf("%Zx\n", m);
}

int main( int argc, char* argv[] ) {

    mpz_init_set_ui(BASE64, 2);
    mpz_pow_ui(BASE64, BASE64, BITS_PER_LIMB);

    if( 2 != argc ) {
        abort();
    }
    if ( !strcmp( argv[ 1 ], "stage1" ) ) {
        while(!feof(stdin)){
            stage1();
        }
    }
    else if( !strcmp( argv[ 1 ], "stage2" ) ) {
        while(1){
            stage2();
            if(feof(stdin)) break;
        }
    }
    else if( !strcmp( argv[ 1 ], "stage3" ) ) {
        while(!feof(stdin)){
            stage3();
        }
    }
    else if( !strcmp( argv[ 1 ], "stage4" ) ) {
        while(!feof(stdin)){
            stage4();
        }
    }
    else {
        abort();
    }

    return 0;
}
  