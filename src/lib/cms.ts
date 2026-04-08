import { supabase } from './supabase';

// ─── Computational Interfaces ───────────────────────────────────────────────

/**
 * Standardized representation of an enterprise service module as defined in the CMS.
 */
export interface EnterpriseServicePayload {
    id: string;
    title: string;
    description: string;
    display_order: number;
    is_active: boolean;
    features: string[];
}

/**
 * Standardized representation of a mission-critical product module.
 */
export interface EnterpriseProductPayload {
    id: string;
    name: string;
    tagline: string;
    description: string;
    theme_color: string;
    logo_url: string;
    screenshots: string[];
    manual_url: string;
    features: string[];
    is_active: boolean;
}

/**
 * Minimal social proof marker for global clients.
 */
export interface EnterpriseClientPayload {
    name: string;
}

/**
 * Options for configuring technical CMS data retrieval protocols.
 */
interface CmsRetrievalProtocolOptions {
    /** Whether to filter for active records only. */
    isActiveOnly?: boolean;
    /** The column identifier to use for ordering results. */
    sortColumn?: string;
    /** Whether to return a single record instead of an array. */
    returnSingle?: boolean;
    /** If true, suppresses console diagnostics for expected failures. */
    isSilentMode?: boolean;
}

// ─── Technical Internal Fetcher ─────────────────────────────────────────────

/**
 * Executes a high-fidelity query against the Supabase database cluster with 
 * standardized error handling and operational overrides.
 */
async function executeCmsProtocolQuery<T>(tableName: string, options: CmsRetrievalProtocolOptions = {}) {
    let protocolQuery = supabase.from(tableName).select('*');

    if (options.isActiveOnly) {
        protocolQuery = protocolQuery.eq('is_active', true);
    }

    if (options.sortColumn) {
        protocolQuery = protocolQuery.order(options.sortColumn, { ascending: true });
    }

    if (options.returnSingle) {
        const { data: recordData, error: queryError } = await protocolQuery.single();
        if (queryError) {
            const isIgnorableError = queryError.code === 'PGRST116' || queryError.code === '42P01' || queryError.code === '42703';
            if (!options.isSilentMode && !isIgnorableError) {
                console.error(`CMS Protocol Failure [${tableName}]:`, queryError.message);
            }
            return null;
        }
        return recordData as T;
    }

    const { data: collectionData, error: queryError } = await protocolQuery;
    if (queryError) {
        const isIgnorableError = queryError.code === '42P01' || queryError.code === '42703';
        if (!options.isSilentMode && !isIgnorableError) {
            console.error(`CMS Protocol Failure [${tableName}]:`, queryError.message);
        }
        return [] as T[];
    }
    return (collectionData || []) as T[];
}

// ─── Public Synchronization APIs ────────────────────────────────────────────

/**
 * Synchronizes the list of active enterprise services from the remote database.
 * 
 * @returns {Promise<EnterpriseServicePayload[]>} A collection of active service pillars.
 */
export async function synchronizeActiveServices(): Promise<EnterpriseServicePayload[]> {
    const { data: serviceNodes, error: syncError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (syncError) {
        console.error("Critical CMS Sync Failure [services]:", syncError.message);
        return executeCmsProtocolQuery<EnterpriseServicePayload>('services', { 
            isSilentMode: true, 
            isActiveOnly: true, 
            sortColumn: 'display_order' 
        }) as Promise<EnterpriseServicePayload[]>;
    }
    return (serviceNodes || []) as EnterpriseServicePayload[];
}

/**
 * Synchronizes global site branding and configuration content.
 * 
 * @returns {Promise<any>} The consolidated site configuration payload.
 */
export async function synchronizeSiteConfig(): Promise<any> {
    const modernConfig = await executeCmsProtocolQuery<any>('site_content', { 
        returnSingle: true, 
        isSilentMode: true 
    });
    if (modernConfig) return modernConfig;
    
    return executeCmsProtocolQuery<any>('site_config', { 
        returnSingle: true, 
        isSilentMode: true 
    });
}

/**
 * Synchronizes the mission-critical product catalog with the global database.
 * 
 * @returns {Promise<EnterpriseProductPayload[]>} A collection of technical product modules.
 */
export async function synchronizeProducts(): Promise<EnterpriseProductPayload[]> {
    const { data: productModules, error: syncError } = await supabase
        .from('products')
        .select('*')
        .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (syncError) {
        console.error("Critical CMS Sync Failure [products]:", syncError.message);
        return [];
    }
    return (productModules || []) as EnterpriseProductPayload[];
}

/**
 * Synchronizes the active client portfolio for real-time social proof marquee.
 * 
 * @returns {Promise<EnterpriseClientPayload[]>} A collection of verified enterprise clients.
 */
export async function synchronizeClientPortfolio(): Promise<EnterpriseClientPayload[]> {
    const { data: portfolioNodes, error: syncError } = await supabase
        .from('clients')
        .select('name')
        .order('created_at', { ascending: true })
        .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (syncError) {
        console.error('Critical CMS Sync Failure [clients]:', syncError.message);
        return [];
    }

    return (portfolioNodes || []) as EnterpriseClientPayload[];
}